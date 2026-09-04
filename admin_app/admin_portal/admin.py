"""
Django Admin registration cho FTC Admin Portal.
Cấu hình giao diện chuẩn mực, sạch sẽ, không dùng icon emoji.
Bao gồm bộ lọc, tìm kiếm, xem chi tiết và xuất CSV.
"""
import csv
from django.contrib import admin
from django.http import HttpResponse
from django.utils.html import format_html

from .models import (
    DeviceCatalog, LabCatalog, Role, FtcUser, TimerSession,
    Region, LoginLog, RosterImportLog, SchemaMigration,
    TrainingClass, ClassEnrollment, AssignmentImportLog,
)


# ===========================================================
# Custom Admin Site
# ===========================================================

admin.site.site_header = "FPT Telecom - FTC Admin Portal"
admin.site.site_title = "FTC Admin"
admin.site.index_title = "Tổng Quan Quản Trị Hệ Thống"


# ===========================================================
# CSV Export Helper
# ===========================================================

def _make_csv_export(filename, fields):
    def export_csv(modeladmin, request, queryset):
        response = HttpResponse(content_type='text/csv; charset=utf-8-sig')
        response['Content-Disposition'] = f'attachment; filename="{filename}.csv"'
        writer = csv.writer(response)
        writer.writerow(fields)
        for obj in queryset:
            row = []
            for f in fields:
                val = getattr(obj, f, '')
                row.append(str(val) if val is not None else '')
            writer.writerow(row)
        return response
    export_csv.short_description = f"Xuất CSV ({filename})"
    return export_csv


# ===========================================================
# DeviceCatalog Admin
# ===========================================================

@admin.register(DeviceCatalog)
class DeviceCatalogAdmin(admin.ModelAdmin):
    list_display = ['device_id', 'device_name', 'model', 'sort_order',
                    'is_active', 'lab_count_badge']
    list_filter = ['is_active']
    search_fields = ['device_id', 'device_name', 'model']
    readonly_fields = ['device_id', 'created_at', 'updated_at']
    ordering = ['sort_order', 'device_name']
    list_per_page = 50

    def lab_count_badge(self, obj):
        count = obj.labs.filter(is_active=True).count()
        bg = '#059669' if count > 0 else '#6b7280'
        return format_html(
            '<span style="background:{};color:#fff;padding:2px 8px;'
            'border-radius:4px;font-size:12px;font-weight:500;">{} bài lab</span>',
            bg, count
        )
    lab_count_badge.short_description = 'Số bài lab'

    actions = [_make_csv_export('device_catalog',
               ['device_id', 'device_name', 'model', 'sort_order', 'is_active'])]


# ===========================================================
# LabCatalog Admin
# ===========================================================

@admin.register(LabCatalog)
class LabCatalogAdmin(admin.ModelAdmin):
    list_display = ['lab_id', 'lab_name', 'device', 'sort_order', 'is_active']
    list_filter = ['is_active', 'device']
    search_fields = ['lab_id', 'lab_name', 'device__device_name']
    readonly_fields = ['lab_id', 'created_at', 'updated_at']
    ordering = ['device_id', 'sort_order']
    list_per_page = 100
    actions = [_make_csv_export('lab_catalog',
               ['lab_id', 'lab_name', 'device_id', 'sort_order', 'is_active'])]


# ===========================================================
# Role Admin (system definitions are read-only)
# ===========================================================

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['role_code', 'role_name', 'is_admin', 'can_export_reports', 'sort_order']
    list_filter = ['is_admin', 'can_export_reports']
    search_fields = ['role_code', 'role_name']
    ordering = ['sort_order', 'role_code']
    readonly_fields = [
        'role_code', 'role_name', 'is_admin', 'can_export_reports',
        'sort_order', 'created_at', 'updated_at',
    ]

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


# ===========================================================
# FtcUser Admin
# ===========================================================

class TerminationFilter(admin.SimpleListFilter):
    title = 'Trạng thái nhân sự'
    parameter_name = 'term_status'

    def lookups(self, request, model_admin):
        return [
            ('active', 'Đang làm việc'),
            ('terminated', 'Đã nghỉ việc'),
        ]

    def queryset(self, request, queryset):
        if self.value() == 'active':
            return queryset.filter(is_terminated=False)
        if self.value() == 'terminated':
            return queryset.filter(is_terminated=True)
        return queryset


@admin.register(FtcUser)
class FtcUserAdmin(admin.ModelAdmin):
    list_display = [
        'display_name', 'employee_id', 'email', 'role',
        'unit_name', 'region_badge', 'branch_badge', 'class_code',
        'employment_status_badge', 'last_login_at',
    ]
    list_filter = ['role', TerminationFilter, 'region']
    search_fields = ['email', 'display_name', 'employee_id',
                     'unit_code', 'unit_name', 'class_code',
                     'region__region_code', 'region__region_name',
                     'region__branch_name']
    list_select_related = ['role', 'region']
    readonly_fields = [
        'user_id', 'last_login_at', 'created_at', 'updated_at',
        'employee_source', 'employee_seed_batch', 'employee_synced_at',
        'region_code', 'dashboard_region',
    ]
    fieldsets = [
        ('Thông tin cơ bản', {
            'fields': ('user_id', 'email', 'display_name', 'role', 'last_login_at')
        }),
        ('Thông tin nhân sự', {
            'fields': ('employee_id', 'job_title', 'class_code',
                       'training_start_date', 'training_end_date')
        }),
        ('Đơn vị & Khu vực', {
            'fields': ('unit_code', 'unit_name', 'region')
        }),
        ('Trạng thái công việc', {
            'fields': ('is_terminated', 'termination_date', 'termination_reason')
        }),
        ('Metadata hệ thống', {
            'classes': ('collapse',),
            'fields': ('employee_source', 'employee_seed_batch',
                       'employee_synced_at', 'region_code', 'dashboard_region',
                       'created_at', 'updated_at')
        }),
    ]
    list_per_page = 50
    show_full_result_count = True
    date_hierarchy = 'created_at'

    def save_model(self, request, obj, form, change):
        # region_id is canonical; keep legacy import/display columns synchronized
        # for older consumers while they are being phased out.
        if obj.region_id and obj.region:
            obj.region_code = obj.region.region_code
            obj.dashboard_region = obj.region.dashboard_group or obj.region.region_name
        super().save_model(request, obj, form, change)

    def region_badge(self, obj):
        if obj.region_id and obj.region:
            return format_html(
                '<span style="background:#1d4ed8;color:#fff;padding:2px 8px;'
                'border-radius:4px;font-size:12px;font-weight:500;">{}</span>',
                obj.region.region_name
            )
        return '-'

    def branch_badge(self, obj):
        return obj.region.branch_name if obj.region_id and obj.region else '-'
    branch_badge.short_description = 'Chi nhánh'
    region_badge.short_description = 'Khu vực'

    def employment_status_badge(self, obj):
        if obj.is_terminated:
            return format_html(
                '<span style="background:#dc2626;color:#fff;padding:2px 8px;'
                'border-radius:4px;font-size:12px;">Đã nghỉ việc</span>'
            )
        return format_html(
            '<span style="background:#059669;color:#fff;padding:2px 8px;'
            'border-radius:4px;font-size:12px;">Đang làm việc</span>'
        )
    employment_status_badge.short_description = 'Trạng thái'

    actions = [_make_csv_export('users',
               ['employee_id', 'display_name', 'email', 'role_id',
                'unit_code', 'unit_name', 'dashboard_region',
                'class_code', 'is_terminated', 'last_login_at'])]


# ===========================================================
# TimerSession Admin
# ===========================================================

class PassedFilter(admin.SimpleListFilter):
    title = 'Kết quả bài thi'
    parameter_name = 'passed'

    def lookups(self, request, model_admin):
        return [
            ('yes', 'Đạt yêu cầu'),
            ('no', 'Không đạt'),
            ('null', 'Chưa xác định'),
        ]

    def queryset(self, request, queryset):
        if self.value() == 'yes':
            return queryset.filter(is_passed=True)
        if self.value() == 'no':
            return queryset.filter(is_passed=False)
        if self.value() == 'null':
            return queryset.filter(is_passed__isnull=True)
        return queryset


class MockDataFilter(admin.SimpleListFilter):
    title = 'Phân loại dữ liệu'
    parameter_name = 'mock'

    def lookups(self, request, model_admin):
        return [
            ('real', 'Dữ liệu thực tế'),
            ('mock', 'Dữ liệu Test/Mock'),
        ]

    def queryset(self, request, queryset):
        if self.value() == 'real':
            return queryset.filter(is_mock=False)
        if self.value() == 'mock':
            return queryset.filter(is_mock=True)
        return queryset


@admin.register(TimerSession)
class TimerSessionAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'name', 'technician_id', 'lab_name', 'device',
        'status_badge', 'passed_badge', 'score', 'duration_display',
        'finished_at', 'data_type_badge',
    ]
    list_filter = [
        'status', PassedFilter, MockDataFilter, 'mode', 'session_type',
        'device',
    ]
    search_fields = [
        'technician_id', 'name', 'email', 'lab_id', 'lab_name',
        'device__device_id', 'device__device_name', 'device_name_snapshot',
    ]
    readonly_fields = [
        'id', 'user', 'created_at', 'started_at', 'finished_at',
        'client_ip', 'user_agent', 'device', 'grading_details_pretty',
    ]
    fieldsets = [
        ('Định danh KTV', {
            'fields': ('id', 'user', 'technician_id', 'name', 'email')
        }),
        ('Bài thực hành', {
            'fields': ('lab_id', 'lab_name', 'device', 'device_name_snapshot',
                       'mode', 'session_type')
        }),
        ('Kết quả đánh giá', {
            'fields': ('status', 'is_passed', 'score', 'completed_first_try',
                       'last_action')
        }),
        ('Thời gian', {
            'fields': ('started_at', 'finished_at', 'created_at')
        }),
        ('Chi tiết chấm điểm', {
            'classes': ('collapse',),
            'fields': ('grading_details_pretty',)
        }),
        ('Telemetry & Audit', {
            'classes': ('collapse',),
            'fields': ('client_ip', 'user_agent', 'is_mock', 'seed_batch')
        }),
    ]
    date_hierarchy = 'finished_at'
    list_select_related = ['user', 'device']
    list_per_page = 50
    show_full_result_count = True

    def status_badge(self, obj):
        colors = {
            'completed': '#059669',
            'failed': '#dc2626',
            'abandoned': '#d97706',
        }
        labels = {
            'completed': 'Hoàn thành',
            'failed': 'Không đạt',
            'abandoned': 'Bỏ dở',
        }
        color = colors.get(obj.status, '#6b7280')
        label = labels.get(obj.status, obj.status)
        return format_html(
            '<span style="background:{};color:#fff;padding:2px 8px;'
            'border-radius:4px;font-size:12px;font-weight:500;">{}</span>',
            color, label
        )
    status_badge.short_description = 'Trạng thái'

    def passed_badge(self, obj):
        if obj.is_passed is None:
            return format_html('<span style="color:#9ca3af;">-</span>')
        if obj.is_passed:
            return format_html(
                '<span style="background:#059669;color:#fff;padding:2px 8px;'
                'border-radius:4px;font-size:12px;font-weight:500;">Đạt</span>'
            )
        return format_html(
            '<span style="background:#dc2626;color:#fff;padding:2px 8px;'
            'border-radius:4px;font-size:12px;font-weight:500;">Không đạt</span>'
        )
    passed_badge.short_description = 'Kết quả'

    def duration_display(self, obj):
        if not obj.duration_sec:
            return '-'
        m, s = divmod(obj.duration_sec, 60)
        h, m = divmod(m, 60)
        if h:
            return f"{h}h {m:02d}m"
        return f"{m}m {s:02d}s"
    duration_display.short_description = 'Thời lượng'

    def data_type_badge(self, obj):
        if obj.is_mock:
            return format_html(
                '<span style="background:#4b5563;color:#fff;padding:2px 6px;'
                'border-radius:4px;font-size:11px;">Test</span>'
            )
        return format_html(
            '<span style="background:#2563eb;color:#fff;padding:2px 6px;'
            'border-radius:4px;font-size:11px;">Thực tế</span>'
        )
    data_type_badge.short_description = 'Loại dữ liệu'

    def grading_details_pretty(self, obj):
        if not obj.grading_details:
            return '-'
        import json
        pretty = json.dumps(obj.grading_details, ensure_ascii=False, indent=2)
        return format_html(
            '<pre style="background:#0f172a;color:#f8fafc;padding:12px;'
            'border-radius:6px;overflow:auto;max-height:400px;font-size:12px;">{}</pre>',
            pretty
        )
    grading_details_pretty.short_description = 'Chi tiết chấm điểm (JSON)'

    def export_real_csv(modeladmin, request, queryset):
        qs = queryset.filter(is_mock=False)
        response = HttpResponse(content_type='text/csv; charset=utf-8-sig')
        response['Content-Disposition'] = 'attachment; filename="timer_sessions_real.csv"'
        writer = csv.writer(response)
        writer.writerow(['session_id', 'technician_id', 'name', 'email',
                         'lab_id', 'lab_name', 'device_id', 'device_snapshot',
                         'mode', 'status',
                         'is_passed', 'score', 'duration_sec', 'finished_at',
                         'client_ip'])
        for obj in qs:
            writer.writerow([
                str(obj.id), obj.technician_id, obj.name, obj.email,
                obj.lab_id, obj.lab_name, obj.device_id,
                obj.device_name_snapshot, obj.mode, obj.status,
                obj.is_passed, obj.score, obj.duration_sec, obj.finished_at,
                obj.client_ip,
            ])
        return response
    export_real_csv.short_description = "Xuất CSV (chỉ dữ liệu thực tế)"

    actions = [export_real_csv,
               _make_csv_export('timer_sessions_all',
               ['id', 'technician_id', 'name', 'email', 'lab_id', 'lab_name',
                'device_id', 'device_name_snapshot', 'mode', 'status',
                'is_passed', 'score',
                'duration_sec', 'finished_at', 'is_mock'])]


# ===========================================================
# Region Admin
# ===========================================================

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ['region_code', 'region_name', 'branch_name',
                    'dashboard_group', 'is_active']
    list_filter = ['is_active', 'dashboard_group']
    search_fields = ['region_code', 'region_name', 'branch_name']
    readonly_fields = ['region_id', 'created_at', 'updated_at']
    list_per_page = 100


# ===========================================================
# Audit logs (read-only)
# ===========================================================

class ReadOnlyAuditAdmin(admin.ModelAdmin):
    actions = None

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(TrainingClass)
class TrainingClassAdmin(ReadOnlyAuditAdmin):
    list_display = ['class_code', 'class_name', 'start_date', 'end_date', 'status', 'created_by']
    list_filter = ['status', 'start_date']
    search_fields = ['class_code', 'class_name']
    list_select_related = ['created_by']


@admin.register(ClassEnrollment)
class ClassEnrollmentAdmin(ReadOnlyAuditAdmin):
    list_display = ['training_class', 'user', 'valid_from', 'valid_to', 'status']
    list_filter = ['status', 'valid_from']
    search_fields = ['training_class__class_code', 'user__employee_id', 'user__email']
    list_select_related = ['training_class', 'user']


@admin.register(AssignmentImportLog)
class AssignmentImportLogAdmin(ReadOnlyAuditAdmin):
    list_display = ['imported_at', 'batch_id', 'file_name', 'imported_by', 'class_count', 'member_count', 'device_count', 'assignment_count', 'error_count']
    search_fields = ['batch_id', 'file_name', 'imported_by__email', 'imported_by__employee_id']
    list_select_related = ['imported_by']


@admin.register(LoginLog)
class LoginLogAdmin(ReadOnlyAuditAdmin):
    list_display = [
        'created_at', 'event_type', 'user', 'employee_id', 'email', 'role',
        'ip_address',
    ]
    list_filter = ['event_type', 'role', 'created_at']
    search_fields = [
        'user__email', 'user__employee_id', 'employee_id', 'email',
        'display_name', 'iam_subject', 'ip_address',
    ]
    list_select_related = ['user']
    date_hierarchy = 'created_at'
    ordering = ['-created_at', '-id']
    list_per_page = 100


@admin.register(RosterImportLog)
class RosterImportLogAdmin(ReadOnlyAuditAdmin):
    list_display = [
        'imported_at', 'batch_id', 'file_name', 'imported_by', 'total_rows',
        'inserted', 'updated', 'terminated', 'reactivated', 'error_count',
    ]
    list_filter = ['imported_at']
    search_fields = [
        'batch_id', 'file_name', 'imported_by__email',
        'imported_by__employee_id',
    ]
    list_select_related = ['imported_by']
    date_hierarchy = 'imported_at'
    ordering = ['-imported_at', '-id']
    list_per_page = 100





# ===========================================================
# SchemaMigration Admin (read-only)
# ===========================================================

@admin.register(SchemaMigration)
class SchemaMigrationAdmin(admin.ModelAdmin):
    list_display = ['version', 'applied_at', 'execution_ms_badge']
    readonly_fields = ['version', 'checksum', 'execution_ms', 'applied_at']
    ordering = ['version']
    list_per_page = 50

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def execution_ms_badge(self, obj):
        ms = obj.execution_ms
        color = '#059669' if ms < 1000 else '#d97706' if ms < 5000 else '#dc2626'
        return format_html(
            '<span style="color:{};font-family:monospace;font-weight:600;">{} ms</span>',
            color, ms
        )
    execution_ms_badge.short_description = 'Thời gian chạy'

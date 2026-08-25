"""
Django models cho FTC Admin Portal.

QUAN TRỌNG: TẤT CẢ models đều có `managed = False` (Meta.managed = False).
Django sẽ KHÔNG tạo, xóa hay thay đổi các bảng này qua migrations.
Models phản chiếu chính xác schema PostgreSQL thực tế trên database Neon.
"""
import uuid
from django.db import models


# ===========================================================
# Device & Lab Catalog
# ===========================================================

class DeviceCatalog(models.Model):
    device_id = models.CharField(max_length=50, primary_key=True, verbose_name='Mã thiết bị')
    model = models.CharField(max_length=100, blank=True, null=True, verbose_name='Model')
    device_name = models.CharField(max_length=100, unique=True, verbose_name='Tên thiết bị')
    is_active = models.BooleanField(default=True, verbose_name='Hoạt động')
    sort_order = models.IntegerField(default=0, verbose_name='Thứ tự')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày tạo')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Cập nhật')

    class Meta:
        managed = False
        db_table = 'device_catalog'
        ordering = ['sort_order', 'device_name']
        verbose_name = 'device_catalog'
        verbose_name_plural = 'device_catalog'

    def __str__(self):
        return f"{self.device_name} ({self.device_id})"


class LabCatalog(models.Model):
    lab_id = models.CharField(max_length=50, primary_key=True, verbose_name='Mã bài lab')
    device = models.ForeignKey(
        DeviceCatalog,
        on_delete=models.CASCADE,
        db_column='device_id',
        verbose_name='Thiết bị',
    )
    lab_name = models.CharField(max_length=150, verbose_name='Tên bài lab')
    is_active = models.BooleanField(default=True, verbose_name='Hoạt động')
    sort_order = models.IntegerField(default=0, verbose_name='Thứ tự')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày tạo')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Cập nhật')

    class Meta:
        managed = False
        db_table = 'lab_catalog'
        ordering = ['device_id', 'sort_order']
        verbose_name = 'lab_catalog'
        verbose_name_plural = 'lab_catalog'

    def __str__(self):
        return f"{self.lab_name} [{self.lab_id}]"


# ===========================================================
# Application roles
# ===========================================================

class Role(models.Model):
    role_code = models.CharField(max_length=20, primary_key=True, verbose_name='Mã role')
    role_name = models.CharField(max_length=100, verbose_name='Tên role')
    is_admin = models.BooleanField(default=False, verbose_name='Quyền quản trị')
    can_export_reports = models.BooleanField(default=False, verbose_name='Được xuất báo cáo')
    sort_order = models.SmallIntegerField(default=0, verbose_name='Thứ tự')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày tạo')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Cập nhật')

    class Meta:
        managed = False
        db_table = 'roles'
        ordering = ['sort_order', 'role_code']
        verbose_name = 'role'
        verbose_name_plural = 'roles'

    def __str__(self):
        return f"{self.role_name} ({self.role_code})"


# ===========================================================
# User (ánh xạ bảng users của hệ thống IAM/PHP)
# ===========================================================

class FtcUser(models.Model):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, verbose_name='User ID')
    email = models.EmailField(unique=True, max_length=254, verbose_name='Email')
    display_name = models.CharField(max_length=255, blank=True, null=True, verbose_name='Tên hiển thị')
    role = models.CharField(
        max_length=20,
        choices=[
            ('KTV', 'Kỹ thuật viên'),
            ('ADMIN', 'Quản trị viên'),
            ('DEV', 'Nhà phát triển'),
        ],
        default='KTV',
        verbose_name='Vai trò',
    )
    employee_id = models.CharField(max_length=50, blank=True, null=True, verbose_name='Mã nhân viên')
    job_title = models.CharField(max_length=200, blank=True, null=True, verbose_name='Chức danh')
    unit_code = models.CharField(max_length=100, blank=True, null=True, verbose_name='Mã đơn vị')
    unit_name = models.CharField(max_length=200, blank=True, null=True, verbose_name='Tên đơn vị')
    region_code = models.CharField(max_length=80, blank=True, null=True, verbose_name='Mã khu vực')
    dashboard_region = models.CharField(max_length=200, blank=True, null=True, verbose_name='Khu vực dashboard')
    region = models.ForeignKey(
        'Region',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        db_column='region_id',
        related_name='technicians',
        verbose_name='Khu vực/chi nhánh hiện tại',
    )
    class_code = models.CharField(max_length=50, blank=True, null=True, verbose_name='Mã lớp')
    training_start_date = models.DateField(blank=True, null=True, verbose_name='Bắt đầu đào tạo')
    training_end_date = models.DateField(blank=True, null=True, verbose_name='Kết thúc đào tạo')
    is_terminated = models.BooleanField(default=False, verbose_name='Đã nghỉ việc')
    termination_date = models.DateField(blank=True, null=True, verbose_name='Ngày nghỉ việc')
    termination_reason = models.TextField(blank=True, null=True, verbose_name='Lý do nghỉ việc')
    employee_source = models.CharField(max_length=200, blank=True, null=True, verbose_name='Nguồn dữ liệu')
    employee_seed_batch = models.CharField(max_length=160, blank=True, null=True, verbose_name='Batch seed')
    employee_synced_at = models.DateTimeField(blank=True, null=True, verbose_name='Đồng bộ lúc')
    last_login_at = models.DateTimeField(blank=True, null=True, verbose_name='Lần đăng nhập cuối')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày tạo')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Cập nhật')

    class Meta:
        managed = False
        db_table = 'users'
        ordering = ['-created_at']
        verbose_name = 'users'
        verbose_name_plural = 'users'

    def __str__(self):
        return f"{self.display_name or self.email} ({self.employee_id or '—'})"


# ===========================================================
# Timer Sessions (PK là bigint id)
# ===========================================================

class TimerSession(models.Model):
    id = models.BigAutoField(primary_key=True, verbose_name='ID Phiên')
    user = models.ForeignKey(
        FtcUser,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        db_column='user_id',
        verbose_name='KTV',
    )
    technician_id = models.CharField(max_length=50, blank=True, null=True, verbose_name='Mã KTV')
    name = models.CharField(max_length=255, blank=True, null=True, verbose_name='Tên')
    email = models.CharField(max_length=255, blank=True, null=True, verbose_name='Email')
    started_at = models.DateTimeField(null=True, blank=True, verbose_name='Bắt đầu')
    finished_at = models.DateTimeField(null=True, blank=True, verbose_name='Kết thúc')
    duration_sec = models.IntegerField(null=True, blank=True, default=0, verbose_name='Thời gian (giây)')
    mode = models.CharField(
        max_length=30,
        choices=[('Thực hành', 'Thực hành'), ('Hướng dẫn', 'Hướng dẫn')],
        default='Thực hành',
        verbose_name='Chế độ',
    )
    device = models.CharField(max_length=200, blank=True, null=True, verbose_name='Thiết bị')
    device_id = models.CharField(max_length=50, blank=True, null=True, verbose_name='Device ID')
    lab_id = models.CharField(max_length=50, blank=True, null=True, verbose_name='Lab ID')
    lab_name = models.CharField(max_length=200, blank=True, null=True, verbose_name='Tên bài lab')
    session_type = models.CharField(max_length=30, default='practice', verbose_name='Loại phiên')
    status = models.CharField(
        max_length=30,
        choices=[
            ('completed', 'Hoàn thành'),
            ('failed', 'Không đạt'),
            ('abandoned', 'Bỏ dở'),
        ],
        default='completed',
        verbose_name='Trạng thái',
    )
    completed_first_try = models.BooleanField(null=True, blank=True, verbose_name='Đạt lần đầu')
    last_action = models.TextField(blank=True, null=True, verbose_name='Hành động cuối')
    is_passed = models.BooleanField(null=True, blank=True, verbose_name='Đạt yêu cầu')
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name='Điểm số')
    grading_details = models.JSONField(null=True, blank=True, verbose_name='Chi tiết chấm điểm')
    client_ip = models.CharField(max_length=50, blank=True, null=True, verbose_name='IP máy KTV')
    user_agent = models.TextField(blank=True, null=True, verbose_name='User Agent')
    is_mock = models.BooleanField(default=False, verbose_name='Dữ liệu Test')
    seed_batch = models.CharField(max_length=160, blank=True, null=True, verbose_name='Batch Seed')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày tạo')

    class Meta:
        managed = False
        db_table = 'timer_sessions'
        ordering = ['-finished_at', '-id']
        verbose_name = 'timer_sessions'
        verbose_name_plural = 'timer_sessions'

    def __str__(self):
        return f"Session #{self.id} - {self.name or self.email} ({self.lab_name})"


# ===========================================================
# Region
# ===========================================================

class Region(models.Model):
    region_id = models.UUIDField(primary_key=True, default=uuid.uuid4, verbose_name='Region ID')
    region_code = models.CharField(max_length=80, unique=True, verbose_name='Mã khu vực')
    region_name = models.TextField(verbose_name='Tên khu vực')
    branch_name = models.TextField(blank=True, null=True, verbose_name='Tên chi nhánh')
    dashboard_group = models.CharField(max_length=100, blank=True, null=True, verbose_name='Nhóm Dashboard')
    is_active = models.BooleanField(default=True, verbose_name='Hoạt động')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Ngày tạo')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Cập nhật')

    class Meta:
        managed = False
        db_table = 'regions'
        ordering = ['region_code']
        verbose_name = 'regions'
        verbose_name_plural = 'regions'

    def __str__(self):
        return f"{self.region_name} ({self.region_code})"


# ===========================================================
# Schema Migrations (read-only)
# ===========================================================

class SchemaMigration(models.Model):
    version = models.CharField(max_length=255, primary_key=True, verbose_name='Phiên bản')
    checksum = models.CharField(max_length=64, verbose_name='Mã kiểm tra Checksum')
    execution_ms = models.IntegerField(verbose_name='Thời gian thực thi (ms)')
    applied_at = models.DateTimeField(verbose_name='Thời điểm áp dụng')

    class Meta:
        managed = False
        db_table = 'schema_migrations'
        ordering = ['version']
        verbose_name = 'schema_migrations'
        verbose_name_plural = 'schema_migrations'

    def __str__(self):
        return self.version

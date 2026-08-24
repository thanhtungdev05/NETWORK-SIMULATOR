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
    created_at = models.DateTimeField(null=True, verbose_name='Ngày tạo')
    updated_at = models.DateTimeField(null=True, verbose_name='Cập nhật')

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
    created_at = models.DateTimeField(null=True, verbose_name='Ngày tạo')
    updated_at = models.DateTimeField(null=True, verbose_name='Cập nhật')

    class Meta:
        managed = False
        db_table = 'lab_catalog'
        ordering = ['device_id', 'sort_order']
        verbose_name = 'lab_catalog'
        verbose_name_plural = 'lab_catalog'

    def __str__(self):
        return f"{self.lab_name} [{self.lab_id}]"


# ===========================================================
# User (ánh xạ bảng users của hệ thống IAM/PHP)
# ===========================================================

class FtcUser(models.Model):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, verbose_name='User ID')
    email = models.EmailField(unique=True, max_length=254, verbose_name='Email')
    display_name = models.CharField(max_length=255, blank=True, null=True, verbose_name='Tên hiển thị')
    role = models.CharField(
        max_length=20,
        choices=[('user', 'KTV / Học viên'), ('admin', 'Quản trị viên')],
        default='user',
        verbose_name='Vai trò',
    )
    employee_id = models.CharField(max_length=50, blank=True, null=True, verbose_name='Mã nhân viên')
    job_title = models.CharField(max_length=200, blank=True, null=True, verbose_name='Chức danh')
    unit_code = models.CharField(max_length=100, blank=True, null=True, verbose_name='Mã đơn vị')
    unit_name = models.CharField(max_length=200, blank=True, null=True, verbose_name='Tên đơn vị')
    region_code = models.CharField(max_length=80, blank=True, null=True, verbose_name='Mã khu vực')
    dashboard_region = models.CharField(max_length=200, blank=True, null=True, verbose_name='Khu vực dashboard')
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
    created_at = models.DateTimeField(null=True, verbose_name='Ngày tạo')
    updated_at = models.DateTimeField(null=True, verbose_name='Cập nhật')

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
    created_at = models.DateTimeField(null=True, verbose_name='Ngày tạo')

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
    created_at = models.DateTimeField(null=True, verbose_name='Ngày tạo')
    updated_at = models.DateTimeField(null=True, verbose_name='Cập nhật')

    class Meta:
        managed = False
        db_table = 'regions'
        ordering = ['region_code']
        verbose_name = 'regions'
        verbose_name_plural = 'regions'

    def __str__(self):
        return f"{self.region_name} ({self.region_code})"


# ===========================================================
# Curricula
# ===========================================================

class Curricula(models.Model):
    curriculum_id = models.UUIDField(primary_key=True, default=uuid.uuid4, verbose_name='Curriculum ID')
    curriculum_code = models.CharField(max_length=80, verbose_name='Mã chương trình')
    version = models.CharField(max_length=50, default='v1.0', verbose_name='Phiên bản')
    curriculum_name = models.TextField(verbose_name='Tên chương trình')
    description = models.TextField(blank=True, null=True, verbose_name='Mô tả')
    status = models.CharField(max_length=30, default='active', verbose_name='Trạng thái')
    is_default = models.BooleanField(default=False, verbose_name='Mặc định')
    created_at = models.DateTimeField(null=True, verbose_name='Ngày tạo')
    updated_at = models.DateTimeField(null=True, verbose_name='Cập nhật')

    class Meta:
        managed = False
        db_table = 'curricula'
        ordering = ['curriculum_code', 'version']
        verbose_name = 'curricula'
        verbose_name_plural = 'curricula'

    def __str__(self):
        return f"{self.curriculum_name} ({self.curriculum_code} {self.version})"


# ===========================================================
# Training Classes
# ===========================================================

class TrainingClass(models.Model):
    class_id = models.UUIDField(primary_key=True, default=uuid.uuid4, verbose_name='Class ID')
    class_code = models.CharField(max_length=50, unique=True, verbose_name='Mã lớp')
    class_name = models.TextField(verbose_name='Tên lớp')
    region_name = models.CharField(max_length=150, verbose_name='Tên khu vực')
    start_date = models.DateField(verbose_name='Ngày bắt đầu')
    end_date = models.DateField(null=True, blank=True, verbose_name='Ngày kết thúc')
    capacity = models.IntegerField(default=30, verbose_name='Sĩ số')
    status = models.CharField(max_length=30, default='active', verbose_name='Trạng thái')
    is_mock = models.BooleanField(default=False, verbose_name='Lớp Demo/Test')
    region = models.ForeignKey(
        Region,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        db_column='region_id',
        verbose_name='Khu vực FK',
    )
    curriculum = models.ForeignKey(
        Curricula,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        db_column='curriculum_id',
        verbose_name='Chương trình',
    )
    created_at = models.DateTimeField(null=True, verbose_name='Ngày tạo')
    updated_at = models.DateTimeField(null=True, verbose_name='Cập nhật')

    class Meta:
        managed = False
        db_table = 'training_classes'
        ordering = ['-start_date']
        verbose_name = 'training_classes'
        verbose_name_plural = 'training_classes'

    def __str__(self):
        return f"{self.class_name} ({self.class_code})"


# ===========================================================
# Class Enrollments (PK là bigint enrollment_id)
# ===========================================================

class ClassEnrollment(models.Model):
    enrollment_id = models.BigAutoField(primary_key=True, verbose_name='ID Ghi danh')
    training_class = models.ForeignKey(
        TrainingClass,
        on_delete=models.CASCADE,
        db_column='class_id',
        verbose_name='Lớp',
    )
    user = models.ForeignKey(
        FtcUser,
        on_delete=models.CASCADE,
        db_column='user_id',
        verbose_name='KTV',
    )
    source_class_code = models.CharField(max_length=50, blank=True, null=True, verbose_name='Mã lớp nguồn')
    status = models.CharField(max_length=30, default='active', verbose_name='Trạng thái')
    valid_from = models.DateField(verbose_name='Hiệu lực từ')
    valid_to = models.DateField(null=True, blank=True, verbose_name='Hiệu lực đến')
    is_mock = models.BooleanField(default=False, verbose_name='Demo/Test')
    created_at = models.DateTimeField(null=True, verbose_name='Ngày tạo')
    updated_at = models.DateTimeField(null=True, verbose_name='Cập nhật')

    class Meta:
        managed = False
        db_table = 'class_enrollments'
        ordering = ['-valid_from', '-enrollment_id']
        verbose_name = 'class_enrollments'
        verbose_name_plural = 'class_enrollments'

    def __str__(self):
        return f"{self.user} -> {self.training_class}"


# ===========================================================
# Lab Grading Criteria
# ===========================================================

class LabGradingCriteria(models.Model):
    criterion_id = models.UUIDField(primary_key=True, default=uuid.uuid4, verbose_name='Criterion ID')
    lab = models.ForeignKey(
        LabCatalog,
        on_delete=models.CASCADE,
        db_column='lab_id',
        verbose_name='Bài lab',
    )
    step_code = models.CharField(max_length=50, verbose_name='Mã bước')
    step_name = models.TextField(verbose_name='Tên bước chấm điểm')
    weight_score = models.DecimalField(max_digits=5, decimal_places=2, default=10.00, verbose_name='Trọng số điểm')
    is_mandatory = models.BooleanField(default=False, verbose_name='Bắt buộc')
    expected_value = models.JSONField(default=dict, verbose_name='Giá trị mong đợi (JSON)')
    sort_order = models.IntegerField(default=0, verbose_name='Thứ tự')
    is_active = models.BooleanField(default=True, verbose_name='Hoạt động')
    created_at = models.DateTimeField(null=True, verbose_name='Ngày tạo')
    updated_at = models.DateTimeField(null=True, verbose_name='Cập nhật')

    class Meta:
        managed = False
        db_table = 'lab_grading_criteria'
        ordering = ['lab_id', 'sort_order']
        unique_together = [('lab', 'step_code')]
        verbose_name = 'lab_grading_criteria'
        verbose_name_plural = 'lab_grading_criteria'

    def __str__(self):
        return f"{self.lab} | {self.step_name} ({self.weight_score}đ)"


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

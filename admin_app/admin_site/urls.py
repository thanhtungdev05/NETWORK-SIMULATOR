"""URL configuration cho FTC Admin Panel."""
from django.contrib import admin
from django.urls import path, include

# Tuỳ chỉnh thương hiệu Django Admin
admin.site.site_header = "FPT Telecom — KTV Admin"
admin.site.site_title = "FTC Admin Portal"
admin.site.index_title = "Quản Trị Hệ Thống Đào Tạo KTV"

urlpatterns = [
    path('admin/', admin.site.urls),
]

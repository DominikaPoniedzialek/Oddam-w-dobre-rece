from django.contrib import admin
from donation.models import Institution

# Register your models here.


@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    pass  # prezentacja Zaawansowane django 18. panel administratora i 19. akcje admina



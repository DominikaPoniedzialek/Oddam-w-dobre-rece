from django.db import models
from django.contrib.auth.models import User

# Create your models here.

INSTITUTIONS = (
    (1, 'foundation'),
    (2, 'non-governmental organization'),
    (3, 'local collection'),
)


class Category(models.Model):
    """Stores category of donated properties."""
    name = models.CharField(max_length=64)

    def __str__(self):
        return self.name


class Institution(models.Model):
    """Stores institution. Related to model Category."""
    name = models.CharField(max_length=64)
    description = models.TextField()
    type = models.IntegerField(choices=INSTITUTIONS, default=1)
    categories = models.ManyToManyField(Category)

    def __str__(self):
        return self.name


class Donation(models.Model):
    """Stores donation. Related to model Institution."""
    quantity = models.IntegerField()
    categories = models.ManyToManyField(Category)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE)
    address = models.CharField(max_length=128)
    phone_number = models.CharField(max_length=64)
    city = models.CharField(max_length=32)
    zip_code = models.IntegerField()
    pick_up_date = models.DateField()
    pick_up_time = models.TimeField()
    pick_up_comment = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    class Meta:
        """Display donations ordered by date."""
        ordering = ['-pick_up_date']

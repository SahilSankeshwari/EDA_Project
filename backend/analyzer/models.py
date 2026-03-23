from django.db import models


class DatasetAnalysis(models.Model):
    file = models.FileField(upload_to="uploads/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    total_rows = models.IntegerField(default=0)
    total_columns = models.IntegerField(default=0)
    summary_file = models.FileField(upload_to="outputs/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"DatasetAnalysis #{self.id}"

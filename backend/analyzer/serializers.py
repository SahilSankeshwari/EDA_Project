from rest_framework import serializers
from .models import DatasetAnalysis


class DatasetAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatasetAnalysis
        fields = [
            "id",
            "file",
            "uploaded_at",
            "total_rows",
            "total_columns",
            "summary_file",
            "created_at",
        ]

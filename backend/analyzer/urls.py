from django.urls import path
from .views import UploadAnalyzeView, DownloadView

urlpatterns = [
    path("upload/", UploadAnalyzeView.as_view(), name="upload"),
    path("download/<str:fmt>/", DownloadView.as_view(), name="download"),
]

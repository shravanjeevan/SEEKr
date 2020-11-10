"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from seekr import views
from knox import views as knox_views

urlpatterns = [

    path('admin/', admin.site.urls),
    
    path('user/register/', views.CreateUser.as_view()),

    path('company/register/', views.CreateCompany.as_view()),

    path('job_seeker/details/', views.JobSeekerDetailsViewSet.as_view()),

    path('skills/add/', views.AddSkill.as_view()),

    path('job_list/add/', views.AddJob.as_view()),
    path('job_list/delete/', views.RemoveJob.as_view()),

    path('job_list/get/', views.Getjoblist.as_view()),

    # path('match_status/add/', views.AddMatchStatus.as_view()),
    path('job_skill/get/', views.GetJobSkill.as_view()),
    path('job_skill/remove/', views.RemoveJobSkill.as_view()),
    path('job_skill/add/', views.AddJobSkill.as_view()),

    path('seeker_skill/add/', views.AddSeekerSkill.as_view()),
    path('seeker_skill/get/', views.GetSeekerSkill.as_view()),
    path('seeker_skill/remove/', views.RemoveSeekerSkill.as_view()),

    path('auth/login', views.LoginAPi.as_view()),
    path('auth/logout', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('user/info/', views.UserApi.as_view()),
    path('user/remove/', views.removeApi.as_view()),

    # Get list of all job matches for a user id
    path('job_match/list/<int:uid>/', views.JobMatchList),
    path('job_match/status/', views.JobMatchStatus.as_view()),

    path('job_match/status/update', views.JobMatchStatusUpdate.as_view()),

    path('job_match/status/company', views.CompanyJobStatus.as_view())

]

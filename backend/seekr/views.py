from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics, viewsets, filters
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import UserSerializer, JobSeekerDetailsSerializer, CompanySerializer, IndustrySerializer, SkillsSerializer, SubIndustrySerializer, JobListSerializer, JobMatchSerializer, SeekerSkillSerializer, JobSkillSerializer

# Models
from django.contrib.auth.models import User
from .models import JobSeekerDetails,Industry,Company, Skills,SubIndustry


class CreateUser(generics.GenericAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "message": "User created"
        })


class CreateCompany(generics.GenericAPIView):
    serializer_class = CompanySerializer

    def post(self, request):
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobSeekerDetailsViewSet(APIView):
    serializer_class = JobSeekerDetailsSerializer

    def get(self, request):
        job_seeker_details = JobSeekerDetails.objects.all()
        serializer = JobSeekerDetailsSerializer(job_seeker_details, many=True)
        return Response(serializer.data)
 
    def post(self, request):
        serializer = JobSeekerDetailsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddIndustry(APIView):
    queryset = Industry.objects.all()
    serializer_class = IndustrySerializer

    def get(self,request):
        industry_list = Industry.objects.all()
        serializer = IndustrySerializer(industry_list,many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = IndustrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddSubIndustry(APIView):
    queryset = SubIndustry.objects.all()
    serializer_class = SubIndustrySerializer

    def get(self,request):
        subindustry_list = SubIndustry.objects.all()
        serializer = SubIndustrySerializer(subindustry_list,many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SubIndustrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddSkill(APIView):
    queryset = Skills.objects.all()
    serializer_class = SkillsSerializer
    search_fields = ['SkillName']
    filter_backends = (filters.SearchFilter,)

    def get(self, request):

        search_fields = ['SkillName']
        filter_backends = (filters.SearchFilter,)
        skill_list = Skills.objects.all()
        serializer = SkillsSerializer(skill_list,many=True)
        print(serializer)
        return Response(serializer.data)

    def post(self, request):
        serializer = SkillsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddJob(APIView):
    serializer_class = JobListSerializer

    def post(self, request):
        serializer = JobListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddMatchStatus(APIView):
    serializer_class = JobMatchSerializer

    def post(self, request):
        serializer = JobMatchSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddSeekerSkill(APIView):
    serializer_class = SeekerSkillSerializer

    def post(self, request):
        serializer = SeekerSkillSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddJobSkill(APIView):
    serializer_class = JobSkillSerializer

    def post(self, request):
        serializer = JobSkillSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
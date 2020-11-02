from django.shortcuts import render
from django.http import HttpResponse
from knox.models import AuthToken
from rest_framework import generics, viewsets, filters
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required

# serializers
from .serializers import *

# Models
from django.contrib.auth.models import User
from .models import JobSeekerDetails, Company, Skills


class CreateUser(generics.GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "message": "User created"
        })


class CreateCompany(generics.GenericAPIView):
    # permission_classes = [permissions.IsAuthenticated, ]

    serializer_class = CompanySerializer

    def post(self, request):
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobSeekerDetailsViewSet(APIView):
    #permission_classes = [permissions.IsAuthenticated, ]

    serializer_class = JobSeekerDetailsSerializer

    def get(self, request):
        job_seeker_details = JobSeekerDetails.objects.all()
        serializer = JobSeekerDetailsSerializer(job_seeker_details, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = JobSeekerDetailsSerializer(data=request.data)
        print(serializer)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddSkill(APIView):
    queryset = Skills.objects.all()
    serializer_class = SkillsSerializer
    search_fields = ['Name']
    filter_backends = (filters.SearchFilter,)

    def get(self, request):
        search_fields = ['Name']
        filter_backends = (filters.SearchFilter,)
        skill_list = Skills.objects.all()
        serializer = SkillsSerializer(skill_list, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SkillsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddJob(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

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
    permission_classes = [permissions.IsAuthenticated, ]

    serializer_class = SeekerSkillSerializer

    def post(self, request):
        serializer = SeekerSkillSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddJobSkill(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    serializer_class = JobSkillSerializer

    def post(self, request):
        serializer = JobSkillSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MatchList(APIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = MatchListSerializer

    def get(self, request):
        # if request.user.is_authenticated:
        serializer = MatchListSerializer(data=request.data)
        return (serializer.generateMatchList())
    # else:
    #    return Response(status=status.HTTP_400_BAD_REQUEST)


class LoginAPi(generics.GenericAPIView):
    serializer_class = LoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = LoginUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        _, token = AuthToken.objects.create(user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token
        })


class UserApi(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = UserSerializer

    def get(self, request):
        print(self.request.user)
        user = User.objects.get(username=self.request.user)
        serializer = UserSerializer(user)
        t = serializer.data
        print(t)

        try:
            user = JobSeekerDetails.objects.get(UserId=t['id'])
            serializer = JobSeekerDetailsSerializer(user)
            print(serializer.data)
            seeker = serializer.data
        except JobSeekerDetails.DoesNotExist:
            print("no seeker user find")
            seeker = dict()
        try:
            user = Company.objects.get(UserId=t['id'])
            serializer = CompanySerializer(user)
            print(serializer.data)
            company = serializer.data

        except Company.DoesNotExist:
            print("no company user find")
            company = dict()

        return Response({
            "account": t,
            "company": company,
            "seekr": seeker
        })

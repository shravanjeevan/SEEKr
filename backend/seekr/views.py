from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from knox.models import AuthToken
from rest_framework import generics, viewsets, filters
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from django.db.models import Exists

# serializers
from .serializers import *

# Models
from django.contrib.auth.models import User
from .models import JobSeekerDetails, Company, Skills, JobSeekerGroups, JobListingGroups


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


class Getjoblist(APIView):
    serializer_class = CompanySerializer

    def post(self, request):
        print(request.data)
        query = JobListing.objects.filter(Company=request.data['Company'])
        serializer = JobListSerializer(query, many=True)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AddJob(APIView):
    # permission_classes = [permissions.IsAuthenticated, ]

    serializer_class = JobListSerializer

    def post(self, request):
        serializer = JobListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddSeekerSkill(APIView):
    # permission_classes = [permissions.IsAuthenticated, ]

    serializer_class = SeekerSkillSerializer

    def post(self, request):
        print(request.data)
        newskill = request.data['Skills']
        try:
            query = Skills.objects.get(Name = newskill)
            serializer = SkillsSerializer(query)
        except Skills.DoesNotExist:
            print(newskill, "does not exist")
            term = dict({"Name": newskill})
            serializer = SkillsSerializer(data=term)
            serializer.is_valid()
            serializer.save()

        query = Skills.objects.get(Name = newskill)
        serializer = SkillsSerializer(query)
        t = dict({"UserId":request.data['UserId'],"SkillsId":serializer.data['id']})
        print(t)
        serializer = SeekerSkillSerializer(data=t)
        serializer.is_valid()
        serializer.save()
        # if serializer.is_valid():
        #     serializer.save()
        #     return Response(serializer.data, status=status.HTTP_201_CREATED)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class GetSeekerSkill(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    serializer_class = UserSerializer

    def get(self, request):
        user = User.objects.get(username=self.request.user)
        serializer = UserSerializer(user)
        t = serializer.data
        print(t)
        try:
            query = JobSeekerSkills.objects.filter(UserId=t['id'])
            serializer = SeekerSkillSerializer(query, many=True)
            print(serializer.data)
            user_skills = list()
            for skill in serializer.data:
                query = Skills.objects.filter(id=skill['SkillsId'])
                serializer = SkillsSerializer(query, many=True)
                temp = dict(serializer.data[0])
                print(temp)
                user_skills.append(temp)

        except JobSeekerSkills.DoesNotExist:
            user_skills = list()
            # serializer = SeekerSkillSerializer(data=request.data)
            # if serializer.is_valid():
                # serializer.save()
                # return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response({"skills": user_skills})


class AddJobSkill(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    serializer_class = JobSkillSerializer

    def post(self, request):
        serializer = JobSkillSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobMatchStatus(APIView):
    serializer_class = JobMatchStatusSerializer

    def get_object(self, job_match_id):
        try:
            return JobMatch.objects.get(id=job_match_id)
        except JobMatch.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        # Update status
        job_match = self.get_object(request.data['JobListingId'])
        job_match.Status = request.data['Status']
        job_match.save()

        # Get return object
        job_match = JobMatch.objects.get(id=request.data['JobListingId'])
        serializer = JobMatchSerializer(job_match)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def JobMatchList(request):
    '''
    Returns list of job matches for a user. Refreshes matches on GET request
    '''
    if request.method == 'GET':
        # Get user
        user_obj = request.user
        # Generate a new list of matches using the matching algorithm
        matches = generateMatchList(user_obj)
        
        # Add each match to the database
        for index, row in matches.iterrows():
            # Check if match already exists
            joblist_obj = JobListing.objects.get(pk=row['job_id'])

            if (JobMatch.objects.filter(JobListingId=joblist_obj, UserId=user_obj).exists()):
                continue
            else:
                # Create new match and save in database
                m = JobMatch(JobListingId=joblist_obj, UserId=user_obj, PercentageMatch=row['percentage'], Status=0)
                m.save()
        
        # Grab the matches for this user
        user_matches = JobMatch.objects.filter(UserId=user_obj)
        serializer = JobMatchSerializer(user_matches, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    else:
        #TODO
        # Just return bad request for now
        return HttpResponse(status=status.HTTP_400_BAD_REQUEST)


def generateJobSkillMat():
    '''Helper function to generate job matches'''
    incidence = pd.DataFrame.from_records(JobListingSkills.objects.values_list('SkillsId_id', 'JobListingId_id'), columns=['skills', 'jobs'])
    skill_ids = np.unique(incidence[['skills']])
    job_ids = np.unique(incidence[['jobs']])
    job_skill_mat = pd.DataFrame(0, index=job_ids, columns=skill_ids)
    for index, row in incidence.iterrows():
        job_skill_mat.loc[row['jobs'], row['skills']] = 1
    job_skill_mat['sum'] = job_skill_mat.sum(axis=1)
    return job_skill_mat

def generateMatchList(user):
    '''Helper function to generate job matches'''
    # Function should take user id as input and return dataframe of job listings annotated with % match
    seeker_skills = list(JobSeekerSkills.objects.filter(UserId=user).values_list('SkillsId_id', flat=True))
    # Sum only skills shared with the seeker
    mat = generateJobSkillMat()
    mat['matching'] = mat[seeker_skills].sum(axis=1)
    # Account for if user profile is textually similar to job description
    seeker_cluster = JobSeekerGroups.objects.get(UserId=user).ClusterId
    shared_group = list(JobListingGroups.objects.filter(ClusterId=seeker_cluster).values_list('JobListingId_id', flat=True))
    mat['shared'] = 0
    # Check if shared groups is empty
    if (len(shared_group) > 0):
        for job in shared_group:
            mat.loc[job, 'shared'] = 1-float(seeker_cluster.NormSize)
    # Calculate % Match
    mat['percentage'] = mat['matching']/mat['sum']+mat['shared']
    mat.fillna(0, inplace=True)
    mat['job_id'] = mat.index
    response = mat[['job_id','percentage']].sort_values(by='percentage', ascending=False)
    return response

def getFeedbackData(user):
    '''Helper function to generate job match feedback'''
    # Function should take user id as input and return dataframe of job_id, difference in skills, matching skills and total skills
    # To be used by different function to generate feedback
    seeker_skills = list(JobSeekerSkills.objects.filter(UserId=user).values_list('SkillsId_id', flat=True))
    # Sum only skills shared with the seeker
    mat = generateJobSkillMat()
    mat['matching'] = mat[seeker_skills].sum(axis=1)
    # Calculate difference (for feedback)
    mat['difference'] = mat['sum']/mat['matching']
    mat['job_id'] = mat.index
    response = mat[['job_id', 'difference', 'matching', 'sum']].to_html()
    return HttpResponse(response)

def generateFeedback(job):
    '''Helper function to generate job match feedback'''
    user = serializers.getCurrentUserDefault()
    mat = getFeedBackData(user)
    JobListingId = set(JobListingSkills.objects.get(JobListing=job).values_list('JobListingId_id', flat=True))
    user_skills = len(list(JobSeekerSkills.objects.filter(UserId=user).values_list('SkillsId_id', flat=True)))
    # below doesn't work --> Used to represent what feedback should look like
    feedback = "%s has %d skills, %s has %d skills. That's %d matched, and %d skills missing." % (user.first_name, user_skills, job.Name, mat.loc[job, 'sum'], mat.loc[job, 'matching'], mat.loc[job, 'difference'])
    return feedback


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

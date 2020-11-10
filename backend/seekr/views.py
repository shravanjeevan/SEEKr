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
    # permission_classes = [permissions.IsAuthenticated, ]

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


class RemoveJob(APIView):
    serializer_class = JobListSerializer

    def post(self, request):
        print(request.data)
        query = JobListing.objects.get(id=request.data['Id'], Company=request.data['Company'])
        query.delete()
        serializer = JobListSerializer(query)

        user = User.objects.get(username=self.request.user)
        serializer = UserSerializer(user)
        t = serializer.data
        print(t)
        job_list = list()
        try:
            query = JobListing.objects.filter(Company=request.data['Company'])
            serializer = JobListSerializer(query, many=True)
            print(serializer.data)
            job_list=serializer.data
        except JobListing.DoesNotExist:
            job_list = list()

        return Response({"job_list": job_list})


class AddJobSkill(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    serializer_class = JobSkillSerializer

    def post(self, request):
        serializer = JobSkillSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            job_skills = list()
            try:
                query = JobListingSkills.objects.filter(JobListingId=request.data["JobListingId"])
                serializer = JobSkillSerializer(query, many=True)
                t = serializer.data
                for skill in serializer.data:
                    query = Skills.objects.filter(id=skill['SkillsId'])
                    serializer = SkillsSerializer(query, many=True)
                    temp = dict(serializer.data[0])
                    print(temp)
                    job_skills.append(temp)
            except JobListingSkills.DoesNotExist:
                job_skills = list()

            return Response({"skills": job_skills})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddSeekerSkill(APIView):
    # permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = SeekerSkillSerializer

    def post(self, request):
        print(request.data)
        serializer = SeekerSkillSerializer(data=request.data)
        serializer.is_valid()
        serializer.save()
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

        return Response({"skills": user_skills})

class RemoveJobSkill(APIView):
    # permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = JobSkillSerializer

    def post(self, request):
        print(request.data)
        query = JobListingSkills.objects.filter(JobListingId=request.data['JobListingId'], SkillsId=request.data['SkillsId'])
        query.delete()
        job_skills = list()
        try:
            query = JobListingSkills.objects.filter(JobListingId=request.data["JobListingId"])
            serializer = JobSkillSerializer(query, many=True)
            t = serializer.data
            job_skills = list()
            for skill in serializer.data:
                query = Skills.objects.filter(id=skill['SkillsId'])
                serializer = SkillsSerializer(query, many=True)
                temp = dict(serializer.data[0])
                print(temp)
                job_skills.append(temp)
        except JobListingSkills.DoesNotExist:
            job_skills = list()

        return Response({"skills": job_skills})


class RemoveSeekerSkill(APIView):
    # permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = SeekerSkillSerializer

    def post(self, request):
        print(request.data)
        query = JobSeekerSkills.objects.filter(UserId=request.data['UserId'], SkillsId=request.data['SkillsId'])
        query.delete()
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


class CompanyJobStatus(APIView):
    serializer_class = JobMatchSerializer

    def post(self, request):
        print(request.data)
        query = JobMatch.objects.filter(JobListingId=request.data['id'], Status="1")
        serializer = JobMatchSerializer(query, many=True)
        userlist = list()
        for u in serializer.data:
            print(u)
            user = User.objects.get(id=u["UserId"])
            serializer = UserSerializer(user)
            info = serializer.data
            user = JobSeekerDetails.objects.get(UserId=u["UserId"])
            serializer = JobSeekerDetailsSerializer(user)
            print(serializer.data)
            extra = serializer.data
            t = dict()
            t.update({"info": info})
            t.update({"extra": extra})
            t.update({"score": u["PercentageMatch"]})
            userlist.append(t)
        print(userlist)
        return Response(userlist)


class GetJobSkill(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    serializer_class = UserSerializer

    def post(self, request):
        print("yoyoyo", request.data)
        try:
            query = JobListingSkills.objects.filter(JobListingId=request.data["JobListingId"])
            serializer = JobSkillSerializer(query, many=True)
            t = serializer.data
            job_skills = list()
            for skill in serializer.data:
                query = Skills.objects.filter(id=skill['SkillsId'])
                serializer = SkillsSerializer(query, many=True)
                temp = dict(serializer.data[0])
                print(temp)
                job_skills.append(temp)
        except JobListingSkills.DoesNotExist:
            job_skills = list()

        return Response({"skills": job_skills})


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

        return Response({"skills": user_skills})


class JobMatchStatusUpdate(APIView):
    serializer_class = JobMatchStatusSerializer

    def post(self, request):
        print(request.data)
        term = JobMatch.objects.get(JobListingId=request.data["JobListingId"], UserId=request.data['UserId'])
        print(term)
        term.Status = request.data['Status']
        term.save()
        return Response({"Status": "done"})


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
def JobMatchList(request, uid):
    '''
    Returns list of job matches for a user. Refreshes matches on GET request
    '''
    if request.method == 'GET':
        # Get user
        user_obj = User.objects.get(pk=uid)
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
        # TODO
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
    # get only skills that seeker shares with all jobs
    shared_skills = [skill for skill in seeker_skills if skill in mat.columns]
    if len(shared_skills) > 0:
        mat['matching'] = mat[shared_skills].sum(axis=1)
    else:
        mat['matching'] = 0
    # Account for if user profile is textually similar to job description
    try:
        seeker_group_obj = JobSeekerGroups.objects.get(UserId=user)
        if seeker_group_obj:
            seeker_cluster = seeker_group_obj.ClusterId
            shared_group = list(JobListingGroups.objects.filter(ClusterId=seeker_cluster).values_list('JobListingId_id', flat=True))
    except:
        shared_group=[]
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
    mat['difference'] = mat['sum'] / mat['matching']
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
    feedback = "%s has %d skills, %s has %d skills. That's %d matched, and %d skills missing." % (
    user.first_name, user_skills, job.Name, mat.loc[job, 'sum'], mat.loc[job, 'matching'], mat.loc[job, 'difference'])
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


class removeApi(generics.GenericAPIView):
    serializer_class = UserSerializer

    def get(self, request):
        user = User.objects.get(username=self.request.user)
        serializer = UserSerializer(user)
        try:
            usert = JobSeekerDetails.objects.get(UserId=serializer.data['id'])
            usert.delete()
        except JobSeekerDetails.DoesNotExist:
            print("no seeker user find")
        try:
            usert = Company.objects.get(UserId=serializer.data['id'])
            usert.delete()

        except Company.DoesNotExist:
            print("no company user find")
        user.delete()

        return Response({"Status": "deleted"})


class UserApi(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = UserSerializer

    def get(self, request):
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

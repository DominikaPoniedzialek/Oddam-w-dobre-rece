from django.contrib.auth import authenticate, login, logout, admin
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Sum, Count
from django.shortcuts import render, redirect
from django.views.generic import View
from django.contrib.auth.models import User
from .models import Institution, Donation, Category
from django.core.paginator import Paginator, EmptyPage, InvalidPage


# Create your views here.


class LandingPageView(View):
    """Display main page of application."""
    template = 'index.html'

    def get(self, request):
        foundations = Institution.objects.filter(type=1)
        ng_organizations = Institution.objects.filter(type=2)
        local_collections = Institution.objects.filter(type=3)
        institutions = Donation.objects.aggregate(Count('institution'))
        bags = Donation.objects.aggregate(Sum('quantity'))
        paginator_foundations = Paginator(foundations, 5)

        try:
            page = int(request.GET.get('page', '1'))
        except:
            page = 1
        try:
            foundation_list = paginator_foundations.page(page)
        except(EmptyPage, InvalidPage):
            foundation_list = paginator_foundations.page(paginator_foundations.num_pages)

        return render(request, self.template, {'foundations': foundations, 'ng_organizations': ng_organizations,
                                               'local_collections': local_collections, 'bags': bags,
                                               'organizations_count': institutions, 'foundation_list': foundation_list})


class AddDonation(View):
    """Add new donation to database."""
    template = 'form.html'

    def get(self, request):
        return render(request, self.template, {})


class LoginView(View):
    """Allow user to log in to application."""
    template = 'login.html'

    def get(self, request):
        return render(request, self.template, {})

    def post(self, request):
        user = authenticate(username=request.POST['email'], password=request.POST['password'])
        if user is not None:
            login(self.request, user)
            return render(request, 'index.html', {'user': user})
        else:
            return redirect('register')


class LogoutView(LoginRequiredMixin, View):
    """Logout user from the application."""
    def get(self, request):
        logout(request)
        return redirect('landing-page')


class RegisterView(View):
    """Allow user to create user account."""
    template = 'register.html'

    def get(self, request):
        return render(request, self.template, {})

    def post(self, request):
        User.objects.create_user(username=request.POST['email'],
                                 password=request.POST['password'],
                                 first_name=request.POST['name'],
                                 last_name=request.POST['surname'],
                                 email=request.POST['email'])
        return redirect('login')


class UserProfileView(LoginRequiredMixin, View):
    """Display user profile."""
    template = 'user_profile.html'

    def get(self, request):
        user = self.request.user
        user_donations = Donation.objects.filter(user=user)
        return render(request, self.template, {'user': user, 'donations': user_donations})

    # def get_queryset(self):
    #     """Return list of user's donation."""
    #     user = self.request.user
    #     return Donation.objects.filter(user=user)


class FormConfirmationView(View):
    """Display confirmation after submitting a form."""
    def get(self, request):
        return render(request, 'form-confirmation.html', {})


class FormView(LoginRequiredMixin, View):
    """Display form to make a donation. Save new object to database."""
    def get(self, request):
        categories = Category.objects.all()
        institutions = Institution.objects.all()
        return render(request, 'form.html', {'categories': categories, 'institutions': institutions})

    def post(self, request):
        bags = int(request.POST['bags'])
        address = request.POST['address']
        city = request.POST['city']
        postcode = int(request.POST['postcode'])
        phone = request.POST['phone']
        date = request.POST['date']
        time = request.POST['time']
        comment = request.POST['more_info']
        institution = Institution.objects.get(pk=request.POST['organization'])
        categories = Category.objects.filter(id__in=request.POST.getlist('categories'))
        user = self.request.user
        new_donation = Donation.objects.create(quantity=bags, address=address, phone_number=phone, city=city,
                                               zip_code=postcode, pick_up_date=date, pick_up_time=time,
                                               pick_up_comment=comment, institution=institution, user=user)
        new_donation.categories.set(categories)
        return redirect('/form_confirmation')

    
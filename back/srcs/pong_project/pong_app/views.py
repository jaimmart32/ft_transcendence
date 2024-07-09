from django.shortcuts import render, HttpResponse

# Create your views here.
def home(request):
    return render(request, "index.html")

def index(request):
    return HttpResponse("Hello, World!")

def greet(request, name):
    return HttpResponse(f"Hello, {name}!")
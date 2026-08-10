import traceback
from django.http import JsonResponse

class TracebackMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_exception(self, request, exception):
        # Catch any exception in Django and return detailed traceback in response
        tb = traceback.format_exc()
        return JsonResponse({
            'error': str(exception),
            'type': exception.__class__.__name__,
            'traceback': tb.split('\n')
        }, status=500)

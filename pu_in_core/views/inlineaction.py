import logging
from django.views.generic.detail import SingleObjectMixin
from django.template.loader import render_to_string
from jsonbase import JSONResponseMixin


log = logging.getLogger("pu.in.core")


class InlineActionMixin(JSONResponseMixin):

    """ Handle action in a JSON way.
    """

    handle_on_get = False
    handle_on_post = True    

    def handle_request(self, *args, **kwargs):

        """ Implement handle call to actually do something... Must
        return a tuple of (status, errors) """

        raise NotImplementedError

    def get(self, request, *args, **kwargs):

        context = self.get_context_data(**kwargs)

        if self.handle_on_post:
            context['status'], context['errors'] = self.handle_request()
        else:
            context['status'] = -1
            context['errors'] = "GET not handled"

        return self.render_to_response(context);

    def post(self, request, *args, **kwargs):

        context = self.get_context_data(**kwargs)

        if self.handle_on_post:
            context['status'], context['errors'] = self.handle_request()
        else:
            context['status'] = -1
            context['errors'] = "POST not handled"

        return self.render_to_response(context);


class InlineObjectActionMixin(InlineActionMixin, SingleObjectMixin):

    """ Action on object """

    def get_context_data(self, **kwargs):

        """ Base implementation that just returns the view's kwargs """

        context = super(InlineObjectActionMixin, 
                        self).get_context_data(**kwargs)

        context['object'] = self.object

        return context

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()
        
        return super(InlineObjectActionMixin, self).get(request, *args, 
                                                        **kwargs)

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        
        return super(InlineObjectActionMixin, self).post(request, *args, 
                                                        **kwargs)

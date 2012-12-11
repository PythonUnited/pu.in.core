Python United Intranet Core
===========================

Inline actions
--------------

The core module provides the JS and Python framework to implement
inline actions, or in other words: actions that result only in a small
part of the page to be renewed to reflect the result of the
action. Think: 'make favorite', 'tweet', etc. To enable this behavior,
you can create a link in your html with the class "action-inline".

The following attributes are supported:

 * pu:action-method  What method to use for the Ajax call. Defaults to GET.
 * pu:action-data  String specifying the data to send to the server

The href attribute will be used to send the request to, the target
attribute will receive the result. If none given, defaults to 'self'.

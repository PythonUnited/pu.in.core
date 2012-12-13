/**
 * pu.in core JS
 * =============
 *
 * As I said: core stuff. This JS lib provides
 * bindings for action-inline links, and submit-inline forms. In both
 * cases the action (action attr for forms, href for links) is handled
 * by Ajax, and the result is inserted in the current page.
 *
 * submit-inline 
 * ------------- 
 * Apply as class to a form, to enable inline submission. Result of
 * the action can be json, or html. In the first case, add a key
 * 'status' with the action result status (0 if ok), and resulting
 * html as 'html' key.  
 * Resulting html will be inserted in the target attribute of the form,
 * if that points to a valid id of an element within the current page.
 * Insert or replace depends on the pu:target-behavior attribute. Valid values 
 * are 'insert', 'replace'. The default is to insert.
 *
 * action-inline
 * -------------
 * Class setting for inline actions. For result handling, see above. Specific 
 * case is where no target is given: default action is to replace the link 
 * itself. If pu:action-method is provided as attribute, the action will be 
 * requested through that method. Default is GET. If pu:action-data is set, this
 * is regarded as a stringified number of parameter/value pairs to be sent as
 * data with the request.
 *
 * For both handlers: if pu:callback is provided as attribute, this JS
 * functoin will be called on success.
 */

// pu_in namespace
if (pu_in == undefined) {
  var pu_in = {};
}


// Our own namespace
pu_in['core'] = {};


pu_in.core.formatErrors = function(dict) {

  var errors = "<dl>";

  for (key in dict) {
    errors += "<dt>" + key + "</dt><dd>" + dict[key] + "</dd>";
  }

  return errors + "</dl>";
};


pu_in.core.detectContentType = function(xhr) {

  var ct = xhr.getResponseHeader("content-type") || "unknown";

  return ct;
}


$(document).ready(function() {

    $(document).on("submit", ".submit-inline", function(e) {

        var form = $(e.target);
        var tgt = form.attr("target") || "";
        var callback = form.attr("pu:callback");

        if (tgt.startsWith("#")) {
          tgt = $(tgt);
        } else if (tgt) {
          tgt = eval("form." + tgt);
        }

        $.ajax(form.attr("action"),
               {type: form.attr("method") || "POST",
                data: form.serialize(),
                success: function(data, status, xhr) {

                   var contentType = pu_in.core.detectContentType(xhr);
                   
                   if (contentType.indexOf("json") > -1) {
                     if (data['status'] != 0) {
                       pg.showMessage(data['errors'], "error");
                     } else {
                       if (tgt) {
                         if (form.attr("pu:target-behavior") == "replace") {
                           tgt.replaceWith(data['html']);
                         } else {
                           tgt.html(data['html']);
                         }
                       } else {
                         form.replaceWith(data['html']);
                       }
                     }                   
                   } else {
                     if (tgt) {
                       if (form.attr("pu:target-behavior") == "replace") {
                         tgt.replaceWith(data);
                       } else {
                         tgt.html(data);
                       }
                     }
                   }
                 }
               });
        
        e.preventDefault();
      });

    $(document).on("click", ".action-inline", function(e) {
        
        var link = $(e.target);

        if (!link.hasClass("action-inline")) {
          link = link.parents(".action-inline");
        }

        var tgt = link.attr("target") || "";
        var callback = link.attr("pu:callback");

        if (tgt.startsWith("#")) {
          tgt = $(tgt);
        } else if (tgt) {
          tgt = eval("link." + tgt);
        }

        $.ajax(link.attr("href"),
               {type: link.attr("pu:action-method") || "GET",
                data: link.attr("pu:action-data") || "",
                success: function(data) {
                   if (data['status'] != 0) {
                     pg.showMessage(data['errors'], "error");                   
                   } else {
                     if (tgt) {
                       if (link.attr("pu:target-behavior") == "replace") {
                         tgt.replaceWith(data['html']);
                       } else {
                         tgt.html(data['html']);
                       }
                     } else {
                       link.replaceWith(data['html']);
                     }
                   }
                   
                   if (callback) {
                     var cb = eval(callback);
                     cb();
                   }
                 }
               });
        
        e.preventDefault();
      });

  });
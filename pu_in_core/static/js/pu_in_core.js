/**
 * pu.in core library. As I said: core stuff.
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


$(document).ready(function() {

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
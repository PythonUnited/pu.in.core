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
        var tgt = link.attr("target") || "";

        if (tgt.startsWith("#")) {
          tgt = $(tgt);
        }
        else if (tgt) {
          tgt = eval("link." + tgt);
        }

        $.post(link.attr("href"),
               link.attr("pu:action-data"),
               function(data) {
                 if (data['status'] != 0) {
                   pg.showMessage(data['errors'], "error");                   
                 } else {
                   if (tgt) {
                     tgt.html(data['html']);
                   } else {
                     link.replaceWith(data['html']);
                   }
                 }
               },
               "json"
               );
        
        e.preventDefault();
      });

  });
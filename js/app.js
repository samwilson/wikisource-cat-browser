$(document).foundation();
$(function() {
    var suffix = ""
    if (lang !== "en") {
        suffix = "_"+lang;
    }
    // Get categories.
    $.get("categories"+suffix+".json", null, function(allCats){
        $(".loading").fadeOut(400, function(){
            $("#catlist").removeClass("hide").fadeIn(400);
        });

        // Last modified date.
        var catLabel;
        $.get("build.php?lang="+lang, null, function(metadata){
            console.log(metadata);
            $("#last-mod").text(metadata.last_modified);
            $("#total-works").text(metadata.works_count);

            catLabel = metadata.category_label;
            catRoot = metadata.category_root;
            // Add categories.
            console.log("getting "+catLabel+":"+catRoot);
            addCats(allCats, $("#catlist"), allCats[catLabel+":"+catRoot], catLabel);
        });

    });
});
function addCats(allCats, $parent, cat, catLabel) {
    $.each(cat, function(i, subcat){
        var title = subcat.replace(/_/g, " ");
        if (subcat.substr(0, catLabel.length+1)==catLabel+":") {
            title = '<span>'+title.substr(catLabel.length+1)+'</span>';
        } else {
            var encodedCat = encodeURIComponent(subcat);
            title = "<a href='https://"+lang+".wikisource.org/wiki/"+encodedCat+"' title='View on Wikisource'>"+title+"</a>"
                + "<a href='http://wsexport.wmflabs.org/tool/book.php?lang="+lang+"&format=epub&page="+encodedCat+"' class='epub'>"
                + " <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/EPUB_silk_icon.svg/15px-EPUB_silk_icon.svg.png'"
                + "     title='Download EPUB' />"
                + "</a>";
        }
        var $newItem = $("<li class='c'>"+title+"<ol class='c'></ol></li>");
        $parent.append($newItem);
        $newItem.find("span").on("click", function(){
            var $sublist = $(this).next("ol");
            if ($sublist.is(":empty")) {
                $(this).addClass("open").removeClass("closed");
                addCats(allCats, $sublist, allCats[subcat], catLabel);
            } else {
                $(this).addClass("closed").removeClass("open");
                $sublist.children().remove();
            }
        })
    });
}
$(document).ready(function() {
    var articleContainer = $(".article-container");

    $(document).on("click", "btn.delete", handleArticleDelete);
    $(document).on("click", "btn.notes", handleArticleNotes);
    $(document).on("click", "btn.save", handleNoteSave);
    $(document).on("click", "btn.note-delete", handleNoteDelete);

    initPage();

    function initPage() {

        articleContainer.empty();

        $.get("/api/headlines?saved=true").then(function(data) {
                if (data && data.length) {
                    renderArticles(data);
                } else {
                    renderEmpty();
                }
            });
    }

    function renderArticles(articles) {
        var articlePanels = [];

        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }

        articleContainer.append(articlePanels);
    }

    function createPanel() {
        var panel = 
        $(["<div class='panel panel-default'>",
            "<div class='panel-heading'>",
            "<h3>",
            article.headline,
            "<a class='btn btn-success save'>",
            "Save Article",
            "</a>",
            "</h3>",
            "</div>",
            "<div class='panel-body'>",
                article.summary,
                "</div>",
            "</div>"].join(""));

            panel.data("_id", article._id);

            return panel;
    }

    function renderEmpty() {
        var emptyAlert = $(["<div class='alert alert-warning text-center'>",
            "<h3>We don't have any saved articles</h3>",
            "</div>",
            "<div class='panel panel-default'>",
                "<h4><a class='scrape-new'>Scrape new articles!</a></h4>",
                "<h4><a href='/'>Try browsing some articles first!</a></h4>",
            "</div>"].join(""));

            articleContainer.append(emptyAlert);
    }

    function handleArticleDelete() {
        var articleToDelete = $(this).parents(".panel").data();

        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete._id
        }).then(function(data) {
            if (data.ok) {
                initPage();
            }
        });
    }
    function handleArticleNotes() {
        var currentArticle = $(this).parents(".panel").data();

        $.get("/api/notes/" + currentArticle._id).then(function(data) {
            var modalText = [
                "<div class='container-fluid text-center'>",
                "<h4>Notes</h4>",
                currentArticle._id,
                "</h4>",
                "<hr />",
                "<ul class='list-group note-container'>",
                "</ul>",
                "<textarea placeholder='Comment' rows='5' cols='55'></textarea>",
                "<button class='btn btn-success save'>Save</button>",
                "</div>"
        ].join("");

        bootbox.dialog({
            message: modalText,
            closeButton: true
        });

        var noteData = {
            _id: currentArticle._id,
            notes: data || []
        };

        $(".btn.save").data("article", noteData);

        renderNotesList(noteData);
        });
    }

    function renderNotesList(data) {
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
            currentNote = [
                "<li class='list-group-item'>",
                "No notes yet",
                "</li>"
            ].join("");
            notesToRender.push(currentNote);
        }
    }

    function handleNoteSave() {
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();

        if (newNote) {
            noteData = {
                _id: $(this).data("article")._id,
                noteText: newNote
            };
            $.post("/api/notes", noteData).then(function() {
                bootbox.hideAll();
            });
        }
    }

    function handleNoteDelete() {
        var noteToDelete = $(this).data("_id");

        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"
        }).then(function() {
            bootbox.hideAll();
        });
    }
});
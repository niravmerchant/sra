var App = {Models: {}, Collections: {}, Views: {}};

App.Models.Study = Backbone.Model.extend();

App.Collections.StudyCollection = Backbone.Collection.extend({
    model: App.Models.Study,
    url: "api/study"
});

App.Views.StudyList = Backbone.View.extend({
    events: {
        'click li a': 'select_study'
    },
    initialize: function(options) {
        console.log(options);
        App.studies.bind('reset', this.add_studies, this);
    },
    render: function() {
        this.$el.html("HELLO WORLD");
    },
    add_studies: function() {
        this.$el.empty();
        var $list = $('<ul>', {id: 'study-list'});
        App.studies.each(function(model) {
            $('<li>')
                .append(
                    $('<a>', {href: '#study/' + model.id}).append(model.id)
                )
                .data('model', model)
                .appendTo($list); 
        });
        this.$el.append($list);
    },
    select_study: function(e) {
        var model = $(e.currentTarget).closest('li').data('model');
        console.log(model);
        App.studies.trigger('select', model);
    }
});

App.Views.ContentArea = Backbone.View.extend({
    initialize: function(options) {
        App.studies.bind('select', this.display_study, this);
    },
    render: function() {
    },
    display_study: function(study) {
        this.$el.empty();
        $('<h2>')
            .append(study.id)
            .appendTo(this.$el);
    }
});

App.Router = Backbone.Router.extend({
    routes: {
        "" : "list",
        "study/:study_id": "select_study"
    },
    initialize: function() {
        App.studies = new App.Collections.StudyCollection();
        new App.Views.StudyList({el: $('#sidebar')[0]}).render();
        new App.Views.ContentArea({el: $('#main')[0]}).render();
    },
    list: function() {
        App.studies.fetch();
        console.log(App.studies);
    },
    select_study: function(study_id) {
        App.studies.fetch({
            success: function() {
                var model;
                if (model = App.studies.get(study_id))
                    App.studies.trigger('select', model);
            }
        });
    }
});

$(document).ready(function() {
    var app = new App.Router();
    Backbone.history.start();
});
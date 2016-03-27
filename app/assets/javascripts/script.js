
//APP
window.App = new Backbone.Marionette.Application();

App.addRegions({
	main: '#main'
});

//Router
App.Router = Backbone.Router.extend({
      routes: {
        ''                : 'first',
        'users'           : 'first',
        'users/new'       : 'newUser',
        'users/:id/edit' : 'editUser',
        'users/:id'      : 'showUser'
      },

      editUser: function (id){
        var model = App.users.findWhere({id: Number(id)});
        var editView = new App.EditView({model: model});
        App.main.show(editView);
      },

      newUser: function (){
        var newUser = new App.User();
        var addForm = new App.AddView({model: newUser});
        App.main.show(addForm);
      },

      first: function () {
        var userListView = new App.UserListView({collection: App.users});
        //regionView.render();
        App.main.show(userListView);
      },

      showUser: function (id) {
        var model = App.users.findWhere({id: Number(id)});
        var showView = new App.ShowView({model: model});
        App.main.show(showView);
      }
    });



//Models&Collections

 App.User = Backbone.Model.extend({
       idAttribute: "id",
      initialize: function(){
        this.set({'id':this.get('id')});
      },
      defaults : {
        first_name  : '',
        last_name   : ''
      },
      paramRoot: 'user'
    });

App.UserList = Backbone.Collection.extend({
      model : App.User,
      url: '/users'
    });

//Views
//model
App.UserView = Backbone.Marionette.ItemView.extend({
      //tagName : 'div class="row"',
      template: JST["templates/user"],
      events : {
        'click .glyphicon-remove' : 'delete'
      },
      delete: function(){
        this.model.destroy();
        App.users.remove(this.model);
        return false;
      }
    });

//collection

App.UserListView = Backbone.Marionette.CompositeView.extend({
       initialize : function(){
        this.collection.fetch({reset:true});
      },
      childView : App.UserView,
      childViewContainer : '.container',
      template: JST["templates/index"],
      events: {
        'keyup #filter': 'filter'
      }
      /*,
      filter: function(e){
        userListView.filter = function (child, index, collection) {
          var query = $(e.currentTarget).val();
          var nameRegex = new RegExp(query, "i");
          return nameRegex.test(child.get('first_name'));
        };
        userListView.render();
      }
*/
    });
//add Form
App.AddView = Backbone.Marionette.ItemView.extend({
	//tagName: 'div class="container"',
	template: JST["templates/new"],

  events    : {
        'click #btn_add' : 'addUser'
      },

  addUser : function (){
        var first_name  = $('#first_name'),
            last_name   = $('#last_name');
        App.users.create({
          first_name: first_name.val(),
          last_name : last_name.val()
        });
        Backbone.history.navigate('#users', { trigger:true, replace: true });
      }
});

//Show User

App.ShowView = Backbone.Marionette.ItemView.extend({
	//tagName: 'div class="container"',
	template: JST["templates/show"],

  serializeData : function(user) {
        // Get the model attributes that need some formatting.
        //var firstName = this.model.get('first_name');
        //var lastName = this.model.get('last_name');

        // Return an object to match the keys in your template.
        return {
            first_name  : this.model.get('first_name'),
            last_name   : this.model.get('last_name')
        };
    }

});

//Edit User

App.EditView = Backbone.Marionette.ItemView.extend({
	//tagName: 'div class="container"',
	template: JST["templates/edit"],
  events: {
          'click #edit_name' : 'editName'
  },
  editName: function() {
    var first_name = $('#edit_first_name').val(),
        last_name  = $('#edit_last_name').val();
  this.model.save({
    first_name: first_name,
    last_name : last_name
  });
Backbone.history.navigate('#users', { trigger:true, replace: true });
  }
});

//Collection

//App.users = new App.UserList ();



//var router = new App.Router();
//App.on('start', function (){
 //     Backbone.history.start();
 //   });


   App.start();


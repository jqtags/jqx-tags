_tag_("jqtags.x.tags",function(select){

  var jq = module("jQuery");

  //$.fn.editable.defaults.mode = 'inline';
  $.fn.editable.defaults.validate = function(v){
    //console.log("validating",v);
    //return "Fuck you"
  };


  var getCustomData = function(callback,queryCallback){
    jQuery.fn.select2.amd.require(
      ['select2/data/array', 'select2/utils'],
      function (ArrayData, Utils) {
        function CustomData($element, options) {
          CustomData.__super__.constructor.call(this, $element, options);
        }

        Utils.Extend(CustomData, ArrayData);

        CustomData.prototype.query = queryCallback;

        callback(CustomData);
      });
  };



  return {
    tagName: "jqx-tags",
    events: {
    },
    accessors: {
      value: {
        type: "string",
        default : "",
        onChange : "valueOnChange"
      },
      popup : {
        type : "boolean",
        default : true
      },
      placeholder : {
        type : "string",
        default : "Enter Value"
      },
      emptyString : {
        type : "string",
        default : "Select"
      }
    },
    attachedCallback : function () {
      var self = this;
      this.$a =
        this.$.innerHTML = '<a href=# data-type=select2 data-title="'+ this.$.placeholder +'" ></a>';
      this.$a =jQuery(this.$).find("a");
      self.mySelectedOptions ={};
      self.selected = [];
      self.setValue(self.$.value);

      self.trigger("jq.init",{
        value : self.$.value,
        populate : function(selected){
          self.selected = selected;
        }
      });

      self.$a.editable({
        send : 'never',
        select2: {
          multiple: true,
          data : [],
          tags : [],
          placeholder : self.$.placeholder,
          query : function(e,b) {
            self.trigger("jq.query",{
              value : self.$.value,
              setOptions : function(options){
                return e.callback({
                  results : options
                });
              }
            });
          },
          formatSelection: function(item) {
            self.mySelectedOptions[item.id] = item.text;
            self.trigger("jq.selected",{
              item : item,
              format : function(disp){
                self.mySelectedOptions[item.id] = disp;
              }
            });
            return item.text;
          },
          initSelection: function (element, callback) {
            callback(self.setValue(self.$.value))
          }
        },
        mode : (self.$.popup ? 'popup' : 'inline')
        // title: 'Enter username'
      }).on("save",debounce(function(e,params){
        self.$.value = params.newValue;
        self.setValue(params.newValue);
        self.trigger("change");
        self.trigger("input");
      })).trigger("change");
    },
    detachedCallback : function(){
      this.$a.editable("destroy");
    },
    setValue : function(newValue){
      if(newValue === undefined) return;
      var finalValues = [];
      var newValues = (newValue+"").split(",");
      this.selected = [];
      for(var i in newValues){
        if(!is.Empty(newValues[i])){
          finalValues.push(this.mySelectedOptions[newValues[i]] || newValues[i]);
          this.selected.push({ id : newValues[i], text : this.mySelectedOptions[newValues[i]] || newValues[i]});
        }
      }
      var finalValue = finalValues.join(",");
      if(!is.Empty(finalValue)){
        this.$a.text(finalValue);
      }
      return this.selected;
    },
    valueOnChange : function(e,oldValue,newValue){
      this.setValue(newValue);
    }
  };
});
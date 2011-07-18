__useLookup__ = true
$ = require "jquery"
severus = require "severus"
_ = require "underscore"
nimble = require "nimble"
drews = require "drews-mixins"
severus = require "severus"
severus.db = "aterciolandia_drewl_us"

{"on":bind, trigger} = drews

define "yo-verse-form-view", () ->

define "yo-view", () ->
  YoView =
    init: () ->
      view =
        _type: YoView
      $(".add-form").submit (e) ->
        e.preventDefault()
        trigger view, "submit",
          line1: $("#line1").val()
          line2: $("#line2").val()
        $("#line1").val("")
        $("#line2").val("")
      view
    addVerse: (yoView, verse) ->
      view = verse.view
      $("#verses").append(view.el)
      
    

    
define "yo-verse-view", () ->
  splitter = $ """
    <div class="pointer red no-quiero">No quiero ser nada que no sea yo, nada que no sea yo</div>
  """
  YoVerseView =
    init: (verse, yoView) ->
      view =
        verse: verse
        _type: YoVerseView
      verse.view = view
      html = $ """
        <div class="verse">
          <div class="verse-part">
            <div>#{verse.line1}</div>
            <div>#{verse.line2}</div>
          </div>
          <div class="delete blue pointer" style="display:none;">Delete</div>
        </div>
      """
      versePart = html.find(".verse-part")
      versePart.click () ->
        if "_id" not of verse then return
        html.find(".delete").toggle("fast")
      html.find(".delete").click () ->
        trigger yoView, "delete", verse

      mySplitter = splitter.clone()
      mySplitter.bind "click", () ->
        # handled internally in the view
        # can dish out to the presenter, but this is internal for now
        $("#no-quiero")[0].play()
      html.append mySplitter
      view.el = html
      view
    remove: (view) ->
      view.el.remove()
      
  return YoVerseView


define "yo-verse", () ->
  YoVerse = 
    init: (verse={}) ->
      verse._type=YoVerse
      return verse
    save: (verse, cb) ->
      verse = _.clone(verse)
      delete verse.view
      delete verse._type
      severus.save "verses", verse, cb
    remove: (verse, cb) ->
      severus.remove "verses", verse._id, cb
    find: (args...) ->
      severus.find "verses", args...
  YoVerse

define "yo-presenter", () ->
  YoView = require "yo-view"
  YoVerseView = require "yo-verse-view"
  YoVerse = require "yo-verse"
  addVerse = (presenter, verse={}) ->
    verse = YoVerse.init verse # if no verse _type
    verse.view = YoVerseView.init verse, presenter.yoView
    presenter.yoView.addVerse verse 
    return verse
  YoPresenter =
    init: () ->
      yoView = YoView.init()
      presenter =  _type: YoPresenter
      presenter.yoView = yoView
      bind yoView, "submit", (verse) ->
        verse = addVerse presenter, verse
        verse.save()
      verse1 = presenter.addVerse
        line1: "yo no quiero ser Soda"
        line2: "y no me importa no estar de moda"
      verse2 = presenter.addVerse
        line1: "yo no quiero ser Julieta"
        line2: "aunque ella sea una mu&#xF1;eca"
      bind yoView, "delete", (verse) ->
        verse.remove (err) ->
          if err
            alert err
          else
            verse.view.remove()

      YoVerse.find (err, verses) ->
        _.each verses, (verse) -> presenter.addVerse verse
      return presenter
    addVerse: addVerse
  return YoPresenter

$ -> 
  yoPresenter = require("yo-presenter").init()
  

    

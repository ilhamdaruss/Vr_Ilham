(function(){
    var script = {
 "mouseWheelEnabled": true,
 "start": "this.playAudioList([this.audio_6F0FE6BC_7AF9_2C77_41DA_81668AD0538A]); this.init(); this.visibleComponentsIfPlayerFlagEnabled([this.IconButton_6D9E5C39_7AD7_1C71_41D4_E258FB20908E], 'gyroscopeAvailable'); this.syncPlaylists([this.ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366_playlist,this.mainPlayList]); if(!this.get('fullscreenAvailable')) { [this.IconButton_6D9E6C39_7AD7_1C71_4186_D67E1D42FBC6].forEach(function(component) { component.set('visible', false); }) }",
 "scrollBarWidth": 10,
 "id": "rootPlayer",
 "mobileMipmappingEnabled": false,
 "vrPolyfillScale": 0.5,
 "propagateClick": false,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "paddingRight": 0,
 "backgroundPreloadEnabled": true,
 "children": [
  "this.MainViewer",
  "this.Container_6D9E3C39_7AD7_1C71_41C6_142BCF67CA89",
  "this.Container_6D862BCE_7AAB_6413_41DB_1DFD9CCEEEE5"
 ],
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "desktopMipmappingEnabled": false,
 "minHeight": 20,
 "scripts": {
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "getKey": function(key){  return window[key]; },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "unregisterKey": function(key){  delete window[key]; },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "registerKey": function(key, value){  window[key] = value; },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "existsKey": function(key){  return key in window; },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } }
 },
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "buttonToggleFullscreen": "this.IconButton_6D9E6C39_7AD7_1C71_4186_D67E1D42FBC6",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "minWidth": 20,
 "layout": "absolute",
 "defaultVRPointer": "laser",
 "horizontalAlign": "left",
 "downloadEnabled": false,
 "gap": 10,
 "height": "100%",
 "paddingTop": 0,
 "buttonToggleMute": "this.IconButton_6D9E4C39_7AD7_1C71_41D3_2C94A336DB12",
 "shadow": false,
 "paddingBottom": 0,
 "borderRadius": 0,
 "class": "Player",
 "data": {
  "name": "Player460"
 },
 "overflow": "visible",
 "definitions": [{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_723ED784_78AE_2210_41D7_240C3277B76A_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 9.75,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6C95C736_7CD8_7C3A_41DA_8D1BF3481231"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -4.41,
   "backwardYaw": -64.46,
   "distance": 1,
   "panorama": "this.panorama_723ED784_78AE_2210_41D7_240C3277B76A"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "label": "Lapangan",
 "id": "panorama_764DDDE7_78B6_6611_41C9_1C1119951A73",
 "thumbnailUrl": "media/panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_775BDE48_78B1_E21F_41BD_54794F0BB2AB"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -82.24,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6D83183E_7CD8_742C_4185_5B301C2C67EC"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -170.25,
   "backwardYaw": 88.36,
   "distance": 1,
   "panorama": "this.panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 44.09,
   "backwardYaw": -80.24,
   "distance": 1,
   "panorama": "this.panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -70.58,
   "backwardYaw": -170.28,
   "distance": 1,
   "panorama": "this.panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "label": "Lantai 2",
 "id": "panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9",
 "thumbnailUrl": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_74AD8E33_7AA9_169D_41B7_055348C3CFF6",
  "this.overlay_74AC84C8_7AA9_6B8B_41A6_2D4B5BD68BA8",
  "this.overlay_7482819B_7AA9_2D8D_41BE_6A7538024D37",
  "this.overlay_77D1EBE6_7AA9_3D86_41A6_0D114D4CE679",
  "this.overlay_74F441D7_7AB9_2D85_41CA_D0EF182D9EF2",
  "this.overlay_74075C4E_7ABB_7A87_41B6_D464C239C826",
  "this.overlay_7422F3DC_7ABE_ED8B_41B2_BCF46B083FFE",
  "this.overlay_7430EB4F_7ABF_FE86_41C3_0CD35F47A30A",
  "this.overlay_740BAB23_7ABB_1EBD_41DE_931B2071CDC4",
  "this.overlay_6FC20291_7AE9_2431_4114_3FE7338DAA88",
  "this.overlay_6E805D5E_7AE9_1C33_41D6_3197A3E25535",
  "this.overlay_6DC2915B_7AF6_E431_41D7_F191620B94B4",
  "this.overlay_6C10BD7D_7AE9_1CF1_41DC_143FB7CFAA82"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 142.89,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_736FF6CE_7CD8_7C6C_41DA_5ACF85B1C87D"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -80.24,
   "backwardYaw": 44.09,
   "distance": 1,
   "panorama": "this.panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "label": "Ruang Kelas VIII",
 "id": "panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D",
 "thumbnailUrl": "media/panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_756C4607_7AAB_3685_41D4_85866A0FFF88"
 ]
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -64.46,
   "backwardYaw": -4.41,
   "distance": 1,
   "panorama": "this.panorama_764DDDE7_78B6_6611_41C9_1C1119951A73"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -1.68,
   "backwardYaw": 51.95,
   "distance": 1,
   "panorama": "this.panorama_762A9352_78B2_2233_41B8_F280EC8EACA8"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 178.39,
   "backwardYaw": -83.48,
   "distance": 1,
   "panorama": "this.panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "label": "Jalan2",
 "id": "panorama_723ED784_78AE_2210_41D7_240C3277B76A",
 "thumbnailUrl": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_7722D9CD_78B1_EE11_41C4_CCC1A56D284F",
  "this.overlay_7675D37B_78B2_62F0_41CC_9439B12DABCD",
  "this.overlay_76351914_78BE_2E37_41D2_9BF06954BBCD",
  "this.overlay_686EAF83_78BE_E210_41CB_744C84B35CE3",
  "this.overlay_6823E73A_78B2_2273_41D3_A10217D0CB17",
  "this.overlay_77A89FA1_78B2_6211_41AF_31074681A9A7",
  "this.overlay_6A02AE5E_7ADE_F687_41D1_35371775AB12"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_camera"
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "media": "this.panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "media": "this.panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_723ED784_78AE_2210_41D7_240C3277B76A_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "media": "this.panorama_723ED784_78AE_2210_41D7_240C3277B76A",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "media": "this.panorama_764DDDE7_78B6_6611_41C9_1C1119951A73",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "media": "this.panorama_762A9352_78B2_2233_41B8_F280EC8EACA8",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "media": "this.panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_76476A60_78AE_220F_41C1_0D6C949662F8_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "media": "this.panorama_76476A60_78AE_220F_41C1_0D6C949662F8",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "media": "this.panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "media": "this.panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "media": "this.panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "media": "this.panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "media": "this.panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 13)",
   "media": "this.panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 13, 14)",
   "media": "this.panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 14, 15)",
   "media": "this.panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 15, 16)",
   "media": "this.panorama_696A774A_78F2_2210_41D6_DCA3CB63C911",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 16, 17)",
   "media": "this.panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 17, 18)",
   "media": "this.panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 18, 19)",
   "media": "this.panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "end": "this.trigger('tourEnded')",
   "camera": "this.panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 19, 0)",
   "media": "this.panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE",
   "player": "this.MainViewerPanoramaPlayer"
  }
 ],
 "id": "mainPlayList"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 9.72,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6CC8C70E_7CD8_7DED_41C5_92CD1BF8DF03"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 96.52,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_7379D6B7_7CD8_7C3C_418F_8E1923B83244"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 45.17,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6CB3F761_7CD8_7C57_41D8_85A12BE4C9D0"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_76476A60_78AE_220F_41C1_0D6C949662F8_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -172.47,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6C500785_7CD8_7CDF_41D3_C68FE5A1BE02"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -11.6,
   "backwardYaw": -26.43,
   "distance": 1,
   "panorama": "this.panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "label": "Ruang Tamu",
 "id": "panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E",
 "thumbnailUrl": "media/panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_69BA5C91_7AE9_7C0E_41CA_2D23932BB04C"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_camera"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -44.95,
   "backwardYaw": 46.85,
   "distance": 1,
   "panorama": "this.panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "label": "Ruang TU",
 "id": "panorama_76476A60_78AE_220F_41C1_0D6C949662F8",
 "thumbnailUrl": "media/panorama_76476A60_78AE_220F_41C1_0D6C949662F8_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_76476A60_78AE_220F_41C1_0D6C949662F8_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_76476A60_78AE_220F_41C1_0D6C949662F8_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_76476A60_78AE_220F_41C1_0D6C949662F8_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_76476A60_78AE_220F_41C1_0D6C949662F8_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_76476A60_78AE_220F_41C1_0D6C949662F8_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_76476A60_78AE_220F_41C1_0D6C949662F8_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_76476A60_78AE_220F_41C1_0D6C949662F8_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_76476A60_78AE_220F_41C1_0D6C949662F8_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_76476A60_78AE_220F_41C1_0D6C949662F8_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_76476A60_78AE_220F_41C1_0D6C949662F8_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_76476A60_78AE_220F_41C1_0D6C949662F8_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_76476A60_78AE_220F_41C1_0D6C949662F8_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_76476A60_78AE_220F_41C1_0D6C949662F8_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_76476A60_78AE_220F_41C1_0D6C949662F8_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_76476A60_78AE_220F_41C1_0D6C949662F8_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_76476A60_78AE_220F_41C1_0D6C949662F8_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_76476A60_78AE_220F_41C1_0D6C949662F8_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_76476A60_78AE_220F_41C1_0D6C949662F8_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_76476A60_78AE_220F_41C1_0D6C949662F8_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_69CEB7C6_7AEA_EC13_41A1_156D962F4951"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 135.05,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6C4E67B1_7CD8_7C34_41D5_2893C99DA97C"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 99.76,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6CD87704_7CD8_7DDD_41DB_0048EA9F3DEE"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -86.6,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_731DC6D9_7CD8_7C77_4187_62D44AEBDF64"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -74.17,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6DA2D853_7CD8_7474_41B9_1EAF07848CBD"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 175.59,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_734686A2_7CD8_7CD5_41D4_266E17654096"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -41.24,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6C6C77D5_7CD8_7C7C_41DB_EA25EC357E5B"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 168.4,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6CA1A776_7CD8_7C3D_41D6_801AD6A990B2"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 70.79,
   "backwardYaw": 105.83,
   "distance": 1,
   "panorama": "this.panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "label": "Ruang UKS",
 "id": "panorama_696A774A_78F2_2210_41D6_DCA3CB63C911",
 "thumbnailUrl": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_6C2D49AC_78D6_2E30_41C2_3313370F63CD",
  "this.overlay_6CCB7282_78D1_E2EA_41B8_8C2A003A047A",
  "this.overlay_6C3D5713_78D2_23E4_41DA_4701550586F0",
  "this.overlay_6C2B435D_78D2_2277_41D3_F0AE3995CB14"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 153.57,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6DB33848_7CD8_7454_41D7_EBF5BA9F989C"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0.58,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_730C46E4_7CD8_7C5D_41DD_4BF2D2867D74"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 11,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_7394B886_7CD8_74DD_41CC_FC87B3A83E1F"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -120.79,
   "backwardYaw": -79.39,
   "distance": 1,
   "panorama": "this.panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -170.28,
   "backwardYaw": -70.58,
   "distance": 1,
   "panorama": "this.panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "label": "Jalan",
 "id": "panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9",
 "thumbnailUrl": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_75DF55A5_7AB7_15BA_41D4_82FDB6BF35EB",
  "this.overlay_75EE655F_7AA9_2A85_41D0_C3D0C4DE8DDD",
  "this.overlay_75571178_7AA9_2A8A_41CA_6DBC81B273C1",
  "this.overlay_7527FAE0_7AA9_1FBA_41C7_AAFF7B88B260",
  "this.overlay_75CB4556_7AAF_2A86_41CA_5253ADFA4775"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 109.42,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6DE52829_7CD8_73D4_41CD_1DAFEDBA9B29"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -91.64,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_732A96F9_7CD8_7C37_41D8_501CDE0876E2"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -135.91,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6C1C87DF_7CD8_7C6B_41D5_C0BD88F0087E"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 84.28,
   "backwardYaw": 138.76,
   "distance": 1,
   "panorama": "this.panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "label": "Lab.Komputer & BAHASA",
 "id": "panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17",
 "thumbnailUrl": "media/panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_69CAB1D7_78F3_FE31_41AA_09ABA0F05147"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -130.86,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6DD70809_7CD8_73D4_41B3_2B3FF51C14E0"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 4.33,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6C5FC79B_7CD8_7CF4_4188_C9F35D13E42B"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 100.61,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6DF5181E_7CD8_73EC_41D7_C5BBEB6BB365"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 94.1,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6CF6C718_7CD8_7DF5_41CC_F5F87B9593A0"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_camera"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -83.48,
   "backwardYaw": 178.39,
   "distance": 1,
   "panorama": "this.panorama_723ED784_78AE_2210_41D7_240C3277B76A"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 97.76,
   "backwardYaw": 94.3,
   "distance": 1,
   "panorama": "this.panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "label": "Jalan1",
 "id": "panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8",
 "thumbnailUrl": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_767A1084_78B2_3E10_41C8_1C6D79F17ACD",
  "this.overlay_7614C335_78B6_6271_4156_AB73B14BD5E2"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_camera"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 94.3,
   "backwardYaw": 97.76,
   "distance": 1,
   "panorama": "this.panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "label": "Bagian Awal",
 "id": "panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A",
 "thumbnailUrl": "media/panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_75A9D464_78B2_6617_41B7_0BA5BDBFB26F"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -85.7,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6C3AE7F4_7CD8_7C3D_41D3_70D9B9B98C81"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -169.7,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_733A46EF_7CD8_7C2B_41D8_B286B82BDF38"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 93.4,
   "backwardYaw": -169,
   "distance": 1,
   "panorama": "this.panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "label": "Mushola & AULA",
 "id": "panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5",
 "thumbnailUrl": "media/panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_6B8DB1EC_78F6_3E17_41DC_703E0DC2AC76"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 98.39,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6D94F833_7CD8_7434_41DB_E3D68FD138DE"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 59.21,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6C7E97C6_7CD8_7C5C_41D5_C6EEB9A85AEE"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 59.18,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6C83974C_7CD8_7C6D_41C1_06F73D0B0D16"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_camera"
},
{
 "class": "PanoramaPlayer",
 "buttonToggleGyroscope": "this.IconButton_6D9E5C39_7AD7_1C71_41D4_E258FB20908E",
 "displayPlaybackBar": true,
 "viewerArea": "this.MainViewer",
 "touchControlMode": "drag_rotation",
 "id": "MainViewerPanoramaPlayer",
 "gyroscopeVerticalDraggingEnabled": true,
 "mouseControlMode": "drag_acceleration"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -1.61,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6C0A67E9_7CD8_7C57_41DC_78FB66383432"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_camera"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -134.83,
   "backwardYaw": 63.01,
   "distance": 1,
   "panorama": "this.panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "label": "Ruang Perpustakaan",
 "id": "panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4",
 "thumbnailUrl": "media/panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_6BAD6EB5_78D6_2204_41A3_73DC3C52B763"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -133.15,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6C2867FF_7CD8_7C2C_41D5_6D5623449CBF"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -179.42,
   "backwardYaw": -85.9,
   "distance": 1,
   "panorama": "this.panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 105.83,
   "backwardYaw": 70.79,
   "distance": 1,
   "panorama": "this.panorama_696A774A_78F2_2210_41D6_DCA3CB63C911"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 88.36,
   "backwardYaw": -170.25,
   "distance": 1,
   "panorama": "this.panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -81.61,
   "backwardYaw": -120.82,
   "distance": 1,
   "panorama": "this.panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 63.01,
   "backwardYaw": -134.83,
   "distance": 1,
   "panorama": "this.panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "label": "Deket Panggung",
 "id": "panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE",
 "thumbnailUrl": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_6ABF506E_78F2_FE13_41D2_75A11C042477",
  "this.overlay_6A4E5BFE_78F2_21F3_41A6_49E11063C2A3",
  "this.overlay_6A8A3ED3_78EE_6231_41D4_A975E3601B77",
  "this.overlay_6A8CD92B_78EE_2E11_41C4_0ABFCB641769",
  "this.overlay_6900291B_78EE_6E31_41D6_07F65F5FBBA9",
  "this.overlay_6A16BCA3_78D2_6610_41B6_D0E30EF1BF6D",
  "this.overlay_6BABB6A3_78D3_E211_41B6_4A19F3CDAC37",
  "this.overlay_6CDEEC2F_78DE_25F1_41B0_CA98A23B2060",
  "this.overlay_6BC093CF_7AD9_6D85_41C6_8D7E6AAF7B59"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 6.91,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_739FF89B_7CD8_74EB_418F_C464CEC3A3A5"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -26.43,
   "backwardYaw": -11.6,
   "distance": 1,
   "panorama": "this.panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 10.3,
   "backwardYaw": 7.53,
   "distance": 1,
   "panorama": "this.panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -173.09,
   "backwardYaw": -175.67,
   "distance": 1,
   "panorama": "this.panorama_762A9352_78B2_2233_41B8_F280EC8EACA8"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 46.85,
   "backwardYaw": -44.95,
   "distance": 1,
   "panorama": "this.panorama_76476A60_78AE_220F_41C1_0D6C949662F8"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "label": "Lorong",
 "id": "panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD",
 "thumbnailUrl": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_68747A14_78D2_2237_41C1_C78B99191C0F",
  "this.overlay_690F742D_78D2_6610_41A0_CB010C830775",
  "this.overlay_777039DD_78DE_2E31_41CD_6D6DCF74D20B",
  "this.overlay_77868BAA_78DF_E210_418F_A334985798E9"
 ]
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 51.95,
   "backwardYaw": -1.68,
   "distance": 1,
   "panorama": "this.panorama_723ED784_78AE_2210_41D7_240C3277B76A"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -175.67,
   "backwardYaw": -173.09,
   "distance": 1,
   "panorama": "this.panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "label": "Gedung Sekolah",
 "id": "panorama_762A9352_78B2_2233_41B8_F280EC8EACA8",
 "thumbnailUrl": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_68873279_78D3_E2F1_41DC_A6901E3E3F1F",
  "this.overlay_7743176B_78D2_6210_41C7_3170297CFC96",
  "this.overlay_68C03AED_78D6_2210_41C9_FB5F871F0812",
  "this.overlay_771881FA_78D2_21F3_41C5_D3F130F7BAE6"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_camera"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 138.76,
   "backwardYaw": 84.28,
   "distance": 1,
   "panorama": "this.panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 49.14,
   "backwardYaw": -37.11,
   "distance": 1,
   "panorama": "this.panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -169,
   "backwardYaw": 93.4,
   "distance": 1,
   "panorama": "this.panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -85.9,
   "backwardYaw": -179.42,
   "distance": 1,
   "panorama": "this.panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 7.53,
   "backwardYaw": 10.3,
   "distance": 1,
   "panorama": "this.panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "label": "Lapangan",
 "id": "panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF",
 "thumbnailUrl": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_682C4F93_78D2_E231_4197_6785110AE8A1",
  "this.overlay_68BE8C6C_78D6_6610_41B4_6B3C8F4B32D6",
  "this.overlay_68153641_78D6_E211_41D3_6B3846C4C512",
  "this.overlay_68A38AFF_78D2_23F1_4185_A895C4119A2C",
  "this.overlay_687EB08C_78D2_FE17_41CC_E0E9776017B5",
  "this.overlay_69D71838_78EE_6E7F_41CC_FECF5A78551F",
  "this.overlay_680313DC_78EE_2230_41BC_8DB80B3D8620",
  "this.overlay_69C83351_78F6_6231_41CF_A359199C3814",
  "this.overlay_69F07849_78F2_6E10_41DC_91E1F251D08C"
 ]
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -120.82,
   "backwardYaw": -81.61,
   "distance": 1,
   "panorama": "this.panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "label": "Lab. MIPA",
 "id": "panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567",
 "thumbnailUrl": "media/panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_6C6545D5_78D1_E60E_41C1_10F1F7D504DF"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 178.32,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_739AA890_7CD8_74F5_41DC_6E84DEA099BA"
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366_playlist, 0, 1)",
   "media": "this.panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366_playlist, 1, 2)",
   "media": "this.panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_723ED784_78AE_2210_41D7_240C3277B76A_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366_playlist, 2, 3)",
   "media": "this.panorama_723ED784_78AE_2210_41D7_240C3277B76A",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366_playlist, 3, 4)",
   "media": "this.panorama_764DDDE7_78B6_6611_41C9_1C1119951A73",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366_playlist, 4, 5)",
   "media": "this.panorama_762A9352_78B2_2233_41B8_F280EC8EACA8",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366_playlist, 5, 6)",
   "media": "this.panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_76476A60_78AE_220F_41C1_0D6C949662F8_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366_playlist, 6, 7)",
   "media": "this.panorama_76476A60_78AE_220F_41C1_0D6C949662F8",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366_playlist, 7, 8)",
   "media": "this.panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366_playlist, 8, 9)",
   "media": "this.panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366_playlist, 9, 10)",
   "media": "this.panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366_playlist, 10, 11)",
   "media": "this.panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366_playlist, 11, 12)",
   "media": "this.panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366_playlist, 12, 13)",
   "media": "this.panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366_playlist, 13, 14)",
   "media": "this.panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366_playlist, 14, 15)",
   "media": "this.panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366_playlist, 15, 16)",
   "media": "this.panorama_696A774A_78F2_2210_41D6_DCA3CB63C911",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366_playlist, 16, 17)",
   "media": "this.panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366_playlist, 17, 18)",
   "media": "this.panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366_playlist, 18, 19)",
   "media": "this.panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_camera",
   "begin": "this.setEndToItemIndex(this.ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366_playlist, 19, 0)",
   "media": "this.panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE",
   "player": "this.MainViewerPanoramaPlayer"
  }
 ],
 "id": "ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366_playlist"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 115.54,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6DC72814_7CD8_73FC_41D0_F8E1BED4EDEE"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -37.11,
   "backwardYaw": 49.14,
   "distance": 1,
   "panorama": "this.panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "label": "Ruang Guru",
 "id": "panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2",
 "thumbnailUrl": "media/panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_69E51227_78F1_E210_41C4_F01092A4CDA7"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -109.21,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6CE54723_7CD8_7DDB_41D1_4893CC2168DA"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -79.39,
   "backwardYaw": -120.79,
   "distance": 1,
   "panorama": "this.panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9"
  }
 ],
 "hfovMin": "150%",
 "hfov": 360,
 "label": "Ruang Kelas VII",
 "id": "panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE",
 "thumbnailUrl": "media/panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 4,
      "tags": "ondemand",
      "colCount": 4,
      "width": 2048,
      "height": 2048
     },
     {
      "url": "media/panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_6BC09CE0_7AA9_1BBB_41D8_EC4D4AA5296B"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -116.99,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_7385B8A6_7CD8_74DD_41BE_8297352BEEEF"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -95.72,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_7364C6C2_7CD8_7C54_41D5_59F4325FE4BC"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -128.05,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_7370F6AC_7CD8_7C2C_41C2_B41218AC1308"
},
{
 "class": "MediaAudio",
 "audio": {
  "class": "AudioResource",
  "mp3Url": "media/audio_6F0FE6BC_7AF9_2C77_41DA_81668AD0538A.mp3",
  "oggUrl": "media/audio_6F0FE6BC_7AF9_2C77_41DA_81668AD0538A.ogg"
 },
 "autoplay": true,
 "id": "audio_6F0FE6BC_7AF9_2C77_41DA_81668AD0538A",
 "data": {
  "label": "Education Background Music No Copyright University Royalty Free"
 }
},
{
 "progressBarBorderColor": "#000000",
 "progressBackgroundColorDirection": "vertical",
 "id": "MainViewer",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarBottom": 5,
 "paddingLeft": 0,
 "playbackBarHeadOpacity": 1,
 "progressBorderColor": "#000000",
 "toolTipBorderColor": "#767676",
 "toolTipShadowSpread": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "width": "100%",
 "minHeight": 50,
 "toolTipFontSize": "2.23vmin",
 "toolTipOpacity": 1,
 "toolTipShadowBlurRadius": 3,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowColor": "#000000",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "playbackBarHeight": 10,
 "minWidth": 100,
 "toolTipPaddingBottom": 4,
 "toolTipFontWeight": "normal",
 "playbackBarProgressBorderSize": 0,
 "toolTipTextShadowBlurRadius": 3,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "height": "100%",
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionMode": "blending",
 "class": "ViewerArea",
 "playbackBarHeadBorderColor": "#000000",
 "shadow": false,
 "toolTipShadowOpacity": 1,
 "progressLeft": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipFontStyle": "normal",
 "playbackBarBorderSize": 0,
 "toolTipShadowHorizontalLength": 0,
 "propagateClick": false,
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontFamily": "Arial Rounded MT Bold",
 "toolTipShadowVerticalLength": 0,
 "vrPointerSelectionColor": "#FF6600",
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "paddingRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "progressRight": 0,
 "borderSize": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadow": true,
 "progressBottom": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#000000",
 "progressHeight": 10,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "paddingTop": 0,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "paddingBottom": 0,
 "toolTipPaddingRight": 6,
 "playbackBarHeadHeight": 15,
 "borderRadius": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBackgroundColorRatios": [
  0
 ],
 "toolTipBorderRadius": 3,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "transitionDuration": 500,
 "data": {
  "name": "Main Viewer"
 }
},
{
 "propagateClick": true,
 "scrollBarWidth": 10,
 "id": "Container_6D9E3C39_7AD7_1C71_41C6_142BCF67CA89",
 "scrollBarColor": "#000000",
 "paddingRight": 0,
 "right": "0.63%",
 "paddingLeft": 0,
 "children": [
  "this.Container_6D9D9C39_7AD7_1C71_41B2_B10B24596706",
  "this.Container_6D9DBC39_7AD7_1C71_41BF_E78F003956ED"
 ],
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "width": 115.05,
 "minHeight": 1,
 "horizontalAlign": "left",
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "layout": "absolute",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "minWidth": 1,
 "height": 641,
 "top": "0.72%",
 "gap": 10,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "shadow": false,
 "paddingBottom": 0,
 "class": "Container",
 "borderRadius": 0,
 "overflow": "scroll",
 "data": {
  "name": "--SETTINGS"
 }
},
{
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarWidth": 10,
 "id": "Container_6D862BCE_7AAB_6413_41DB_1DFD9CCEEEE5",
 "left": "0%",
 "propagateClick": true,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "paddingRight": 0,
 "right": "0%",
 "children": [
  "this.Container_6D864BCE_7AAB_6413_41A4_C022E715813E"
 ],
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "backgroundColorDirection": "vertical",
 "verticalAlign": "top",
 "scrollBarOpacity": 0.48,
 "layout": "absolute",
 "bottom": "0%",
 "contentOpaque": false,
 "minWidth": 1,
 "creationPolicy": "inAdvance",
 "top": "0%",
 "click": "this.setComponentVisibility(this.Container_6D862BCE_7AAB_6413_41DB_1DFD9CCEEEE5, false, 0, null, null, false)",
 "horizontalAlign": "left",
 "scrollBarMargin": 2,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 10,
 "paddingTop": 0,
 "shadow": false,
 "paddingBottom": 0,
 "backgroundOpacity": 0.07,
 "borderRadius": 0,
 "visible": false,
 "class": "Container",
 "data": {
  "name": "--PANORAMA LIST"
 },
 "overflow": "scroll"
},
{
 "transparencyActive": true,
 "maxHeight": 58,
 "propagateClick": true,
 "id": "IconButton_6D9E6C39_7AD7_1C71_4186_D67E1D42FBC6",
 "paddingRight": 0,
 "paddingLeft": 0,
 "borderSize": 0,
 "width": 58,
 "minHeight": 1,
 "horizontalAlign": "center",
 "verticalAlign": "middle",
 "iconURL": "skin/IconButton_6D9E6C39_7AD7_1C71_4186_D67E1D42FBC6.png",
 "pressedRollOverIconURL": "skin/IconButton_6D9E6C39_7AD7_1C71_4186_D67E1D42FBC6_pressed_rollover.png",
 "minWidth": 1,
 "mode": "toggle",
 "height": 58,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "shadow": false,
 "paddingBottom": 0,
 "class": "IconButton",
 "borderRadius": 0,
 "pressedIconURL": "skin/IconButton_6D9E6C39_7AD7_1C71_4186_D67E1D42FBC6_pressed.png",
 "cursor": "hand",
 "maxWidth": 58,
 "data": {
  "name": "IconButton FULLSCREEN"
 }
},
{
 "transparencyActive": true,
 "maxHeight": 58,
 "propagateClick": true,
 "id": "IconButton_6D9E4C39_7AD7_1C71_41D3_2C94A336DB12",
 "paddingRight": 0,
 "paddingLeft": 0,
 "borderSize": 0,
 "width": 58,
 "minHeight": 1,
 "horizontalAlign": "center",
 "verticalAlign": "middle",
 "iconURL": "skin/IconButton_6D9E4C39_7AD7_1C71_41D3_2C94A336DB12.png",
 "pressedRollOverIconURL": "skin/IconButton_6D9E4C39_7AD7_1C71_41D3_2C94A336DB12_pressed_rollover.png",
 "minWidth": 1,
 "mode": "toggle",
 "height": 58,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "shadow": false,
 "paddingBottom": 0,
 "class": "IconButton",
 "borderRadius": 0,
 "pressedIconURL": "skin/IconButton_6D9E4C39_7AD7_1C71_41D3_2C94A336DB12_pressed.png",
 "cursor": "hand",
 "maxWidth": 58,
 "data": {
  "name": "IconButton MUTE"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Keluar Lapangan",
   "click": "this.startPanoramaWithCamera(this.panorama_723ED784_78AE_2210_41D7_240C3277B76A, this.camera_6DC72814_7CD8_73FC_41D0_F8E1BED4EDEE); this.mainPlayList.set('selectedIndex', 2)"
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 7.37,
   "image": "this.AnimatedImageResource_604A1B5A_7AFA_E433_419E_79CE66A1B407",
   "pitch": 0.85,
   "yaw": -4.41,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_775BDE48_78B1_E21F_41BD_54794F0BB2AB",
 "maps": [
  {
   "hfov": 7.37,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -4.41,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": 0.85
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Menuju Lantai 1",
   "click": "this.startPanoramaWithCamera(this.panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE, this.camera_732A96F9_7CD8_7C37_41D8_501CDE0876E2); this.mainPlayList.set('selectedIndex', 12)"
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 6.21,
   "image": "this.AnimatedImageResource_6FCE8BB6_7AFA_E473_41D2_749B87C5CE87",
   "pitch": -18.16,
   "yaw": -170.25,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_74AD8E33_7AA9_169D_41B7_055348C3CFF6",
 "maps": [
  {
   "hfov": 6.21,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -170.25,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -18.16
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Ruang Kelas VIII",
   "click": "this.startPanoramaWithCamera(this.panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D, this.camera_6CD87704_7CD8_7DDD_41DB_0048EA9F3DEE); this.mainPlayList.set('selectedIndex', 17)"
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 9.45,
   "image": "this.AnimatedImageResource_6FCEABB6_7AFA_E473_41DD_E7468DB7F7B4",
   "pitch": 2.47,
   "yaw": 44.09,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_74AC84C8_7AA9_6B8B_41A6_2D4B5BD68BA8",
 "maps": [
  {
   "hfov": 9.45,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 44.09,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 2.47
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 5.24,
   "image": "this.AnimatedImageResource_6FCECBB6_7AFA_E473_41DB_43D02794E12C",
   "pitch": -4.22,
   "yaw": 109.95,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_7482819B_7AA9_2D8D_41BE_6A7538024D37",
 "data": {
  "label": "Info 02"
 },
 "maps": [
  {
   "hfov": 5.24,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 109.95,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -4.22
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": true,
 "items": [
  {
   "hfov": 22.43,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_1_HS_3_0.png",
      "class": "ImageResourceLevel",
      "width": 335,
      "height": 133
     }
    ]
   },
   "pitch": -3.31,
   "yaw": 110.33,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_77D1EBE6_7AA9_3D86_41A6_0D114D4CE679",
 "data": {
  "label": "Tempat Pengisian Minum"
 },
 "maps": [
  {
   "hfov": 22.43,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 110.33,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_1_HS_3_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 40,
      "height": 16
     }
    ]
   },
   "pitch": -3.31
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 2.31,
   "image": "this.AnimatedImageResource_6FCD0BB6_7AFA_E473_41D5_C466D0FECCB7",
   "pitch": 4.49,
   "yaw": 16.56,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_74F441D7_7AB9_2D85_41CA_D0EF182D9EF2",
 "data": {
  "label": "Info 02"
 },
 "maps": [
  {
   "hfov": 2.31,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 16.56,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_1_HS_4_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 4.49
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": true,
 "items": [
  {
   "hfov": 20.75,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_1_HS_5_0.png",
      "class": "ImageResourceLevel",
      "width": 311,
      "height": 97
     }
    ]
   },
   "pitch": 5,
   "yaw": 22.03,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_74075C4E_7ABB_7A87_41B6_D464C239C826",
 "data": {
  "label": "Toilet Akhwat "
 },
 "maps": [
  {
   "hfov": 20.75,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 22.03,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_1_HS_5_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 51,
      "height": 16
     }
    ]
   },
   "pitch": 5
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 5.86,
   "image": "this.AnimatedImageResource_6FCD3BB6_7AFA_E473_41D0_D61AF7463057",
   "pitch": 0.11,
   "yaw": 157.88,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_7422F3DC_7ABE_ED8B_41B2_BCF46B083FFE",
 "data": {
  "label": "Info 02"
 },
 "maps": [
  {
   "hfov": 5.86,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 157.88,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_1_HS_6_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.11
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": true,
 "items": [
  {
   "hfov": 16.02,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_1_HS_7_0.png",
      "class": "ImageResourceLevel",
      "width": 239,
      "height": 159
     }
    ]
   },
   "pitch": 1.23,
   "yaw": 157.85,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_7430EB4F_7ABF_FE86_41C3_0CD35F47A30A",
 "data": {
  "label": "Ruang Kelas VIII"
 },
 "maps": [
  {
   "hfov": 16.02,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 157.85,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_1_HS_7_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": 1.23
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Jalan",
   "click": "this.startPanoramaWithCamera(this.panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9, this.camera_6CC8C70E_7CD8_7DED_41C5_92CD1BF8DF03); this.mainPlayList.set('selectedIndex', 18)"
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 6.38,
   "image": "this.AnimatedImageResource_6FCD7BB6_7AFA_E473_41D5_976F1E23819B",
   "pitch": -7.52,
   "yaw": -70.58,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_740BAB23_7ABB_1EBD_41DE_931B2071CDC4",
 "maps": [
  {
   "hfov": 6.38,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -70.58,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_1_HS_8_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -7.52
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 3.68,
   "image": "this.AnimatedImageResource_6FCD9BB7_7AFA_E471_41D2_DFB0F531B9D1",
   "pitch": 3.16,
   "yaw": -95.64,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_6FC20291_7AE9_2431_4114_3FE7338DAA88",
 "data": {
  "label": "Info 02"
 },
 "maps": [
  {
   "hfov": 3.68,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -95.64,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_1_HS_9_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 3.16
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": true,
 "items": [
  {
   "hfov": 12.34,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_1_HS_10_0.png",
      "class": "ImageResourceLevel",
      "width": 184,
      "height": 112
     }
    ]
   },
   "pitch": 4.08,
   "yaw": -92.81,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_6E805D5E_7AE9_1C33_41D6_3197A3E25535",
 "data": {
  "label": "Ruang Kelas VII"
 },
 "maps": [
  {
   "hfov": 12.34,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -92.81,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_1_HS_10_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": 4.08
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 4.51,
   "image": "this.AnimatedImageResource_6216643B_7AB9_2C72_41CF_B64600BF37FC",
   "pitch": -3.22,
   "yaw": -149.64,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_6DC2915B_7AF6_E431_41D7_F191620B94B4",
 "data": {
  "label": "Info 02"
 },
 "maps": [
  {
   "hfov": 4.51,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -149.64,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_0_HS_11_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -3.22
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 12.03,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_0_HS_12_0.png",
      "class": "ImageResourceLevel",
      "width": 179,
      "height": 135
     }
    ]
   },
   "pitch": -1.04,
   "yaw": -149.4,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_6C10BD7D_7AE9_1CF1_41DC_143FB7CFAA82",
 "data": {
  "label": "  Masih Tahap \u000d Pembangunan"
 },
 "maps": [
  {
   "hfov": 12.03,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -149.4,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_0_HS_12_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 21,
      "height": 16
     }
    ]
   },
   "pitch": -1.04
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Keluar Ruangan Kelas",
   "click": "this.startPanoramaWithCamera(this.panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9, this.camera_6C1C87DF_7CD8_7C6B_41D5_C0BD88F0087E); this.mainPlayList.set('selectedIndex', 16)"
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 6.88,
   "image": "this.AnimatedImageResource_6FCDDBB7_7AFA_E471_41CA_E61F8AD7FBE1",
   "pitch": 1.64,
   "yaw": -80.24,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_756C4607_7AAB_3685_41D4_85866A0FFF88",
 "maps": [
  {
   "hfov": 6.88,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -80.24,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 1.64
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Menuju Keluar Area Sekolah",
   "click": "this.startPanoramaWithCamera(this.panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8, this.camera_7379D6B7_7CD8_7C3C_418F_8E1923B83244); this.mainPlayList.set('selectedIndex', 1)"
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.65,
   "image": "this.AnimatedImageResource_60444B59_7AFA_E431_41DC_CF907C8F3A4A",
   "pitch": -7.4,
   "yaw": 178.39,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_7722D9CD_78B1_EE11_41C4_CCC1A56D284F",
 "maps": [
  {
   "hfov": 4.65,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 178.39,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -7.4
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 3.87,
   "image": "this.AnimatedImageResource_6044AB59_7AFA_E431_41D8_7ECA1EE71E19",
   "pitch": 2.52,
   "yaw": 50.16,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_7675D37B_78B2_62F0_41CC_9439B12DABCD",
 "data": {
  "label": "Info 02"
 },
 "maps": [
  {
   "hfov": 3.87,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 50.16,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 2.52
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": true,
 "items": [
  {
   "hfov": 23.46,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0_HS_2_0.png",
      "class": "ImageResourceLevel",
      "width": 350,
      "height": 125
     }
    ]
   },
   "pitch": 3.78,
   "yaw": 50.32,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_76351914_78BE_2E37_41D2_9BF06954BBCD",
 "data": {
  "label": "Parkiran Motor"
 },
 "maps": [
  {
   "hfov": 23.46,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 50.32,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0_HS_2_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 44,
      "height": 16
     }
    ]
   },
   "pitch": 3.78
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Menuju Lapangan",
   "click": "this.startPanoramaWithCamera(this.panorama_764DDDE7_78B6_6611_41C9_1C1119951A73, this.camera_734686A2_7CD8_7CD5_41D4_266E17654096); this.mainPlayList.set('selectedIndex', 3)"
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.68,
   "image": "this.AnimatedImageResource_604B0B59_7AFA_E431_4184_0371B58EFD99",
   "pitch": -3.35,
   "yaw": -64.46,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_686EAF83_78BE_E210_41CB_744C84B35CE3",
 "maps": [
  {
   "hfov": 4.68,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -64.46,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -3.35
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": true,
 "items": [
  {
   "hfov": 22.59,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0_HS_4_0.png",
      "class": "ImageResourceLevel",
      "width": 337,
      "height": 138
     }
    ]
   },
   "pitch": 2.73,
   "yaw": -103.5,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_6823E73A_78B2_2273_41D3_A10217D0CB17",
 "data": {
  "label": "Parkiran Mobil"
 },
 "maps": [
  {
   "hfov": 22.59,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -103.5,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0_HS_4_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 39,
      "height": 16
     }
    ]
   },
   "pitch": 2.73
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 4.69,
   "image": "this.AnimatedImageResource_604B8B59_7AFA_E431_41D9_B9A41E098E9E",
   "pitch": 1.39,
   "yaw": -104.23,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_77A89FA1_78B2_6211_41AF_31074681A9A7",
 "data": {
  "label": "Info 02"
 },
 "maps": [
  {
   "hfov": 4.69,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -104.23,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0_HS_5_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 1.39
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Menuju Gedung Sekolah",
   "click": "this.startPanoramaWithCamera(this.panorama_762A9352_78B2_2233_41B8_F280EC8EACA8, this.camera_7370F6AC_7CD8_7C2C_41C2_B41218AC1308); this.mainPlayList.set('selectedIndex', 4)"
  }
 ],
 "data": {
  "label": "Arrow 02c Right-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 6.69,
   "image": "this.AnimatedImageResource_604BBB59_7AFA_E431_41DC_127A0BA272E7",
   "pitch": -2.1,
   "yaw": -1.68,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_6A02AE5E_7ADE_F687_41D1_35371775AB12",
 "maps": [
  {
   "hfov": 6.69,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -1.68,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0_HS_6_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": -2.1
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Keluar Ruangan",
   "click": "this.startPanoramaWithCamera(this.panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD, this.camera_6DB33848_7CD8_7454_41D7_EBF5BA9F989C); this.mainPlayList.set('selectedIndex', 5)"
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 13.33,
   "image": "this.AnimatedImageResource_604F1B5B_7AFA_E431_41B4_FD5522A46E9D",
   "pitch": 5.74,
   "yaw": -11.6,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_69BA5C91_7AE9_7C0E_41CA_2D23932BB04C",
 "maps": [
  {
   "hfov": 13.33,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -11.6,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 5.74
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Keluar Ruangan",
   "click": "this.startPanoramaWithCamera(this.panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD, this.camera_6C2867FF_7CD8_7C2C_41D5_6D5623449CBF); this.mainPlayList.set('selectedIndex', 5)"
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 13.39,
   "image": "this.AnimatedImageResource_6048CB5B_7AFA_E431_41C5_F6E52ED2E4EA",
   "pitch": 1.9,
   "yaw": -44.95,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_69CEB7C6_7AEA_EC13_41A1_156D962F4951",
 "maps": [
  {
   "hfov": 13.39,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -44.95,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_76476A60_78AE_220F_41C1_0D6C949662F8_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 1.9
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Keluar Ruangan ",
   "click": "this.startPanoramaWithCamera(this.panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE, this.camera_6DA2D853_7CD8_7474_41B9_1EAF07848CBD); this.mainPlayList.set('selectedIndex', 12)"
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 6.8,
   "image": "this.AnimatedImageResource_6FCD7BB5_7AFA_E471_41C6_FA2E4F5BFA3E",
   "pitch": 4.34,
   "yaw": 70.79,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_6C2D49AC_78D6_2E30_41C2_3313370F63CD",
 "maps": [
  {
   "hfov": 6.8,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 70.79,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 4.34
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 5.52,
   "image": "this.AnimatedImageResource_6FCD9BB5_7AFA_E471_41B4_2BDF51ED57DF",
   "pitch": 4.56,
   "yaw": 138.56,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Kamar 1"
  }
 ],
 "id": "overlay_6CCB7282_78D1_E2EA_41B8_8C2A003A047A",
 "data": {
  "label": "Info 02"
 },
 "maps": [
  {
   "hfov": 5.52,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 138.56,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 4.56
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 5.51,
   "image": "this.AnimatedImageResource_6FCDBBB5_7AFA_E471_41DE_7EED9810C37A",
   "pitch": 4.68,
   "yaw": 171.14,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Ruang Konsultasi"
  }
 ],
 "id": "overlay_6C3D5713_78D2_23E4_41DA_4701550586F0",
 "data": {
  "label": "Info 02"
 },
 "maps": [
  {
   "hfov": 5.51,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 171.14,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 4.68
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 5.8,
   "image": "this.AnimatedImageResource_6FCDDBB5_7AFA_E471_41DB_16D7D79D8BF8",
   "pitch": 2.58,
   "yaw": -159.31,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Kamar 2"
  }
 ],
 "id": "overlay_6C2B435D_78D2_2277_41D3_F0AE3995CB14",
 "data": {
  "label": "Info 02"
 },
 "maps": [
  {
   "hfov": 5.8,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -159.31,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_1_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 2.58
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Ruang Kelas VII",
   "click": "this.startPanoramaWithCamera(this.panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE, this.camera_6DF5181E_7CD8_73EC_41D7_C5BBEB6BB365); this.mainPlayList.set('selectedIndex', 19)"
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 13.39,
   "image": "this.AnimatedImageResource_6FCDFBB7_7AFA_E471_41DC_D8CCE915648F",
   "pitch": 0.25,
   "yaw": -120.79,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_75DF55A5_7AB7_15BA_41D4_82FDB6BF35EB",
 "maps": [
  {
   "hfov": 13.39,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -120.79,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.25
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 2.82,
   "image": "this.AnimatedImageResource_6FCC1BB7_7AFA_E471_41CE_10F15005685C",
   "pitch": 1.45,
   "yaw": 0.61,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_75EE655F_7AA9_2A85_41D0_C3D0C4DE8DDD",
 "data": {
  "label": "Info 02"
 },
 "maps": [
  {
   "hfov": 2.82,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 0.61,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 1.45
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": true,
 "items": [
  {
   "hfov": 8.16,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_1_HS_2_0.png",
      "class": "ImageResourceLevel",
      "width": 121,
      "height": 100
     }
    ]
   },
   "pitch": 3.22,
   "yaw": 0.91,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_75571178_7AA9_2A8A_41CA_6DBC81B273C1",
 "data": {
  "label": "  Ruang Kelas VII"
 },
 "maps": [
  {
   "hfov": 8.16,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 0.91,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_1_HS_2_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 19,
      "height": 16
     }
    ]
   },
   "pitch": 3.22
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 1.44,
   "image": "this.AnimatedImageResource_6FCC5BB7_7AFA_E471_41C2_AF0210F88A3B",
   "pitch": 1.36,
   "yaw": 5.13,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Toilet Ikhwan "
  }
 ],
 "id": "overlay_7527FAE0_7AA9_1FBA_41C7_AAFF7B88B260",
 "data": {
  "label": "Info 02"
 },
 "maps": [
  {
   "hfov": 1.44,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 5.13,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_1_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 1.36
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Jalan",
   "click": "this.startPanoramaWithCamera(this.panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9, this.camera_6DE52829_7CD8_73D4_41CD_1DAFEDBA9B29); this.mainPlayList.set('selectedIndex', 16)"
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 13.16,
   "image": "this.AnimatedImageResource_6FCC7BB7_7AFA_E471_41DA_4456C327947B",
   "pitch": -22.29,
   "yaw": -170.28,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_75CB4556_7AAF_2A86_41CA_5253ADFA4775",
 "maps": [
  {
   "hfov": 13.16,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -170.28,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_1_HS_4_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -22.29
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Keluar Ruangan",
   "click": "this.startPanoramaWithCamera(this.panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF, this.camera_6C6C77D5_7CD8_7C7C_41DB_EA25EC357E5B); this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 6.38,
   "image": "this.AnimatedImageResource_604E6B5D_7AFA_E431_41D6_7B0F5BBA47CB",
   "pitch": 0,
   "yaw": 84.28,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_69CAB1D7_78F3_FE31_41AA_09ABA0F05147",
 "maps": [
  {
   "hfov": 6.38,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 84.28,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Menuju SMPIT BIS",
   "click": "this.startPanoramaWithCamera(this.panorama_723ED784_78AE_2210_41D7_240C3277B76A, this.camera_6C0A67E9_7CD8_7C57_41DC_78FB66383432); this.mainPlayList.set('selectedIndex', 2)"
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.69,
   "image": "this.AnimatedImageResource_77CAB0D6_78B2_DE30_41DB_E2EDCC801DB2",
   "pitch": -1.47,
   "yaw": -83.48,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_767A1084_78B2_3E10_41C8_1C6D79F17ACD",
 "maps": [
  {
   "hfov": 4.69,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -83.48,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -1.47
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Keluar Area Sekolah",
   "click": "this.startPanoramaWithCamera(this.panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A, this.camera_6C3AE7F4_7CD8_7C3D_41D3_70D9B9B98C81); this.mainPlayList.set('selectedIndex', 0)"
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.67,
   "image": "this.AnimatedImageResource_6045FB58_7AFA_E43F_41C6_2C478EA2E50B",
   "pitch": -5.2,
   "yaw": 97.76,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_7614C335_78B6_6271_4156_AB73B14BD5E2",
 "maps": [
  {
   "hfov": 4.67,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 97.76,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -5.2
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Jalan Menuju SMPIT BIS",
   "click": "this.startPanoramaWithCamera(this.panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8, this.camera_6D83183E_7CD8_742C_4185_5B301C2C67EC); this.mainPlayList.set('selectedIndex', 1)"
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.66,
   "image": "this.AnimatedImageResource_77C870D4_78B2_DE30_41D5_A130E1AC6FC0",
   "pitch": -5.94,
   "yaw": 94.3,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_75A9D464_78B2_6617_41B7_0BA5BDBFB26F",
 "maps": [
  {
   "hfov": 4.66,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 94.3,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -5.94
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Keluar Ruangan",
   "click": "this.startPanoramaWithCamera(this.panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF, this.camera_7394B886_7CD8_74DD_41CC_FC87B3A83E1F); this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 7.27,
   "image": "this.AnimatedImageResource_604D1B5D_7AFA_E431_41D6_880D3855463D",
   "pitch": 0.3,
   "yaw": 93.4,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_6B8DB1EC_78F6_3E17_41DC_703E0DC2AC76",
 "maps": [
  {
   "hfov": 7.27,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 93.4,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.3
  }
 ]
},
{
 "transparencyActive": true,
 "maxHeight": 58,
 "propagateClick": true,
 "id": "IconButton_6D9E5C39_7AD7_1C71_41D4_E258FB20908E",
 "paddingRight": 0,
 "paddingLeft": 0,
 "borderSize": 0,
 "width": 58,
 "minHeight": 1,
 "horizontalAlign": "center",
 "verticalAlign": "middle",
 "iconURL": "skin/IconButton_6D9E5C39_7AD7_1C71_41D4_E258FB20908E.png",
 "pressedRollOverIconURL": "skin/IconButton_6D9E5C39_7AD7_1C71_41D4_E258FB20908E_pressed_rollover.png",
 "minWidth": 1,
 "mode": "toggle",
 "height": 58,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "shadow": false,
 "paddingBottom": 0,
 "class": "IconButton",
 "borderRadius": 0,
 "pressedIconURL": "skin/IconButton_6D9E5C39_7AD7_1C71_41D4_E258FB20908E_pressed.png",
 "cursor": "hand",
 "maxWidth": 58,
 "data": {
  "name": "IconButton GYRO"
 }
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Keluar Ruangan",
   "click": "this.startPanoramaWithCamera(this.panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE, this.camera_7385B8A6_7CD8_74DD_41BE_8297352BEEEF); this.mainPlayList.set('selectedIndex', 12)"
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 5.78,
   "image": "this.AnimatedImageResource_6FCD5BB5_7AFA_E471_41D5_52D072E7D116",
   "pitch": 1.28,
   "yaw": -134.83,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_6BAD6EB5_78D6_2204_41A3_73DC3C52B763",
 "maps": [
  {
   "hfov": 5.78,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -134.83,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 1.28
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Lab. MIPA",
   "click": "this.startPanoramaWithCamera(this.panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567, this.camera_6C83974C_7CD8_7C6D_41C1_06F73D0B0D16); this.mainPlayList.set('selectedIndex', 13)"
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.01,
   "image": "this.AnimatedImageResource_604D5B5D_7AFA_E431_41CA_E9AA42AC8503",
   "pitch": 1.27,
   "yaw": -81.61,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_6ABF506E_78F2_FE13_41D2_75A11C042477",
 "maps": [
  {
   "hfov": 4.01,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -81.61,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 1.27
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": true,
 "items": [
  {
   "hfov": 6.77,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_0_HS_1_0.png",
      "class": "ImageResourceLevel",
      "width": 101,
      "height": 134
     }
    ]
   },
   "pitch": 6.31,
   "yaw": 30.53,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_6A4E5BFE_78F2_21F3_41A6_49E11063C2A3",
 "data": {
  "label": "Toilet\u000dAkhwat"
 },
 "maps": [
  {
   "hfov": 6.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 30.53,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_0_HS_1_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 21
     }
    ]
   },
   "pitch": 6.31
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 4,
   "image": "this.AnimatedImageResource_604DFB5D_7AFA_E431_41DA_D4D959BEFDEF",
   "pitch": 4.3,
   "yaw": 30.26,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_6A8A3ED3_78EE_6231_41D4_A975E3601B77",
 "data": {
  "label": "Info 02"
 },
 "maps": [
  {
   "hfov": 4,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 30.26,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 4.3
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 4.01,
   "image": "this.AnimatedImageResource_604C3B5D_7AFA_E431_41C8_0E29E28A0D3A",
   "pitch": 4.13,
   "yaw": -41.42,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_6A8CD92B_78EE_2E11_41C4_0ABFCB641769",
 "data": {
  "label": "Info 02"
 },
 "maps": [
  {
   "hfov": 4.01,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -41.42,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_1_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 4.13
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": true,
 "items": [
  {
   "hfov": 6.77,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_0_HS_4_0.png",
      "class": "ImageResourceLevel",
      "width": 101,
      "height": 134
     }
    ]
   },
   "pitch": 6.26,
   "yaw": -40.65,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_6900291B_78EE_6E31_41D6_07F65F5FBBA9",
 "data": {
  "label": "Toilet\u000dIkhwan"
 },
 "maps": [
  {
   "hfov": 6.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -40.65,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_0_HS_4_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 21
     }
    ]
   },
   "pitch": 6.26
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Ruang Perpustakaan",
   "click": "this.startPanoramaWithCamera(this.panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4, this.camera_6CB3F761_7CD8_7C57_41D8_85A12BE4C9D0); this.mainPlayList.set('selectedIndex', 14)"
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.96,
   "image": "this.AnimatedImageResource_604CAB5E_7AFA_E49D_41D7_0C1E8659743B",
   "pitch": 0.95,
   "yaw": 63.01,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_6A16BCA3_78D2_6610_41B6_D0E30EF1BF6D",
 "maps": [
  {
   "hfov": 4.96,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 63.01,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_1_HS_5_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.95
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Ruang UKS",
   "click": "this.startPanoramaWithCamera(this.panorama_696A774A_78F2_2210_41D6_DCA3CB63C911, this.camera_6CE54723_7CD8_7DDB_41D1_4893CC2168DA); this.mainPlayList.set('selectedIndex', 15)"
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.13,
   "image": "this.AnimatedImageResource_6FCE9BB4_7AFA_E477_41D5_199F909A84F5",
   "pitch": 0.53,
   "yaw": 105.83,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_6BABB6A3_78D3_E211_41B6_4A19F3CDAC37",
 "maps": [
  {
   "hfov": 4.13,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 105.83,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_1_HS_6_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 0.53
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Menuju Lantai 2",
   "click": "this.startPanoramaWithCamera(this.panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9, this.camera_6C95C736_7CD8_7C3A_41DA_8D1BF3481231); this.mainPlayList.set('selectedIndex', 16)"
  }
 ],
 "data": {
  "label": "Arrow 06"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 5.22,
   "image": "this.AnimatedImageResource_6FCEBBB4_7AFA_E477_41BE_48A9C31EC308",
   "pitch": -2.73,
   "yaw": 88.36,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_6CDEEC2F_78DE_25F1_41B0_CA98A23B2060",
 "maps": [
  {
   "hfov": 5.22,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 88.36,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_1_HS_7_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 30,
      "height": 16
     }
    ]
   },
   "pitch": -2.73
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Jalan",
   "click": "this.startPanoramaWithCamera(this.panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF, this.camera_6CF6C718_7CD8_7DF5_41CC_F5F87B9593A0); this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.46,
   "image": "this.AnimatedImageResource_6FCEDBB4_7AFA_E477_41DB_5B5E69671CD4",
   "pitch": -17.85,
   "yaw": -179.42,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_6BC093CF_7AD9_6D85_41C6_8D7E6AAF7B59",
 "maps": [
  {
   "hfov": 4.46,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -179.42,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_1_HS_8_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -17.85
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Keluar Gedung Sekolah",
   "click": "this.startPanoramaWithCamera(this.panorama_762A9352_78B2_2233_41B8_F280EC8EACA8, this.camera_6C5FC79B_7CD8_7CF4_4188_C9F35D13E42B); this.mainPlayList.set('selectedIndex', 4)"
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.6,
   "image": "this.AnimatedImageResource_60497B5A_7AFA_E433_41DE_149293761BE9",
   "pitch": -11.24,
   "yaw": -173.09,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_68747A14_78D2_2237_41C1_C78B99191C0F",
 "maps": [
  {
   "hfov": 4.6,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -173.09,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -11.24
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Jalan",
   "click": "this.startPanoramaWithCamera(this.panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF, this.camera_6C500785_7CD8_7CDF_41D3_C68FE5A1BE02); this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.65,
   "image": "this.AnimatedImageResource_6049AB5A_7AFA_E433_41D5_4DD0702D278D",
   "pitch": -7.12,
   "yaw": 10.3,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_690F742D_78D2_6610_41A0_CB010C830775",
 "maps": [
  {
   "hfov": 4.65,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 10.3,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -7.12
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Ruang Tamu",
   "click": "this.startPanoramaWithCamera(this.panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E, this.camera_6CA1A776_7CD8_7C3D_41D6_801AD6A990B2); this.mainPlayList.set('selectedIndex', 7)"
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.68,
   "image": "this.AnimatedImageResource_60481B5B_7AFA_E431_41DA_E8F9052D9435",
   "pitch": 3.15,
   "yaw": -26.43,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_777039DD_78DE_2E31_41CD_6D6DCF74D20B",
 "maps": [
  {
   "hfov": 4.68,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -26.43,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 3.15
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Ruang TU",
   "click": "this.startPanoramaWithCamera(this.panorama_76476A60_78AE_220F_41C1_0D6C949662F8, this.camera_6C4E67B1_7CD8_7C34_41D5_2893C99DA97C); this.mainPlayList.set('selectedIndex', 6)"
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.68,
   "image": "this.AnimatedImageResource_60486B5B_7AFA_E431_41CB_DB24B8D8D296",
   "pitch": 1.98,
   "yaw": 46.85,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_77868BAA_78DF_E210_418F_A334985798E9",
 "maps": [
  {
   "hfov": 4.68,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 46.85,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_1_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 1.98
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Menuju Keluar ",
   "click": "this.startPanoramaWithCamera(this.panorama_723ED784_78AE_2210_41D7_240C3277B76A, this.camera_739AA890_7CD8_74F5_41DC_6E84DEA099BA); this.mainPlayList.set('selectedIndex', 2)"
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.68,
   "image": "this.AnimatedImageResource_604A5B5A_7AFA_E433_41AD_3331D8941413",
   "pitch": -3.94,
   "yaw": 51.95,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_68873279_78D3_E2F1_41DC_A6901E3E3F1F",
 "maps": [
  {
   "hfov": 4.68,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 51.95,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -3.94
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": true,
 "items": [
  {
   "hfov": 11.63,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_1_HS_1_0.png",
      "class": "ImageResourceLevel",
      "width": 173,
      "height": 105
     }
    ]
   },
   "pitch": 3.26,
   "yaw": -107.63,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_7743176B_78D2_6210_41C7_3170297CFC96",
 "data": {
  "label": "Parkiran"
 },
 "maps": [
  {
   "hfov": 11.63,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -107.63,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_1_HS_1_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 26,
      "height": 16
     }
    ]
   },
   "pitch": 3.26
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 3.01,
   "image": "this.AnimatedImageResource_604AEB5A_7AFA_E433_41D9_9DADCF45D9CD",
   "pitch": 1.63,
   "yaw": -108.18,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_68C03AED_78D6_2210_41C9_FB5F871F0812",
 "data": {
  "label": "Info 02"
 },
 "maps": [
  {
   "hfov": 3.01,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -108.18,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 1.63
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Menuju Lorong Sekolah",
   "click": "this.startPanoramaWithCamera(this.panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD, this.camera_739FF89B_7CD8_74EB_418F_C464CEC3A3A5); this.mainPlayList.set('selectedIndex', 5)"
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.67,
   "image": "this.AnimatedImageResource_60492B5A_7AFA_E433_41C0_84201A49BA1D",
   "pitch": -5.34,
   "yaw": -175.67,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_771881FA_78D2_21F3_41C5_D3F130F7BAE6",
 "maps": [
  {
   "hfov": 4.67,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -175.67,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_1_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -5.34
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Jalan",
   "click": "this.startPanoramaWithCamera(this.panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD, this.camera_733A46EF_7CD8_7C2B_41D8_B286B82BDF38); this.mainPlayList.set('selectedIndex', 5)"
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.63,
   "image": "this.AnimatedImageResource_6049EB5B_7AFA_E431_41CA_90BE299BF5E0",
   "pitch": -8.92,
   "yaw": 7.53,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_682C4F93_78D2_E231_4197_6785110AE8A1",
 "maps": [
  {
   "hfov": 4.63,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 7.53,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -8.92
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Ruang Guru",
   "click": "this.startPanoramaWithCamera(this.panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2, this.camera_736FF6CE_7CD8_7C6C_41DA_5ACF85B1C87D); this.mainPlayList.set('selectedIndex', 10)"
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.35,
   "image": "this.AnimatedImageResource_60482B5B_7AFA_E431_41DB_563A9AE03715",
   "pitch": 1.38,
   "yaw": 49.14,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_68BE8C6C_78D6_6610_41B4_6B3C8F4B32D6",
 "maps": [
  {
   "hfov": 4.35,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 49.14,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 1.38
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Lab.Komputer & BAHASA",
   "click": "this.startPanoramaWithCamera(this.panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17, this.camera_7364C6C2_7CD8_7C54_41D5_59F4325FE4BC); this.mainPlayList.set('selectedIndex', 9)"
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.35,
   "image": "this.AnimatedImageResource_60488B5C_7AFA_E437_41D5_24B6F34495F5",
   "pitch": -1.21,
   "yaw": 138.76,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_68153641_78D6_E211_41D3_6B3846C4C512",
 "maps": [
  {
   "hfov": 4.35,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 138.76,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -1.21
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 1.77,
   "image": "this.AnimatedImageResource_6048DB5C_7AFA_E437_41DE_0CCCB7240A83",
   "pitch": -0.92,
   "yaw": 108.13,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_68A38AFF_78D2_23F1_4185_A895C4119A2C",
 "data": {
  "label": "Info 02"
 },
 "maps": [
  {
   "hfov": 1.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 108.13,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_1_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -0.92
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": true,
 "items": [
  {
   "hfov": 6.81,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_1_HS_4_0.png",
      "class": "ImageResourceLevel",
      "width": 101,
      "height": 69
     }
    ]
   },
   "pitch": 0.16,
   "yaw": 108.37,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_687EB08C_78D2_FE17_41CC_E0E9776017B5",
 "data": {
  "label": " Kantin"
 },
 "maps": [
  {
   "hfov": 6.81,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 108.37,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_1_HS_4_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 23,
      "height": 16
     }
    ]
   },
   "pitch": 0.16
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 1.74,
   "image": "this.AnimatedImageResource_604F4B5C_7AFA_E437_41B7_9F7BC069FFC1",
   "pitch": -0.69,
   "yaw": 73.18,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_69D71838_78EE_6E7F_41CC_FECF5A78551F",
 "data": {
  "label": "Info 02"
 },
 "maps": [
  {
   "hfov": 1.74,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 73.18,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_1_HS_5_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -0.69
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": true,
 "items": [
  {
   "hfov": 7.91,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_1_HS_6_0.png",
      "class": "ImageResourceLevel",
      "width": 118,
      "height": 89
     }
    ]
   },
   "pitch": 1.21,
   "yaw": 73.81,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_680313DC_78EE_2230_41BC_8DB80B3D8620",
 "data": {
  "label": " Tempat \u000dPenitipan"
 },
 "maps": [
  {
   "hfov": 7.91,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 73.81,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_1_HS_6_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 21,
      "height": 16
     }
    ]
   },
   "pitch": 1.21
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Jalan Deket Panggung",
   "click": "this.startPanoramaWithCamera(this.panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE, this.camera_730C46E4_7CD8_7C5D_41DD_4BF2D2867D74); this.mainPlayList.set('selectedIndex', 12)"
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.69,
   "image": "this.AnimatedImageResource_604FBB5C_7AFA_E437_41CB_F69D9DF1FE37",
   "pitch": -1.23,
   "yaw": -85.9,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_69C83351_78F6_6231_41CF_A359199C3814",
 "maps": [
  {
   "hfov": 4.69,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -85.9,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_1_HS_7_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -1.23
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Mushola & AULA",
   "click": "this.startPanoramaWithCamera(this.panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5, this.camera_731DC6D9_7CD8_7C77_4187_62D44AEBDF64); this.mainPlayList.set('selectedIndex', 11)"
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 4.71,
   "image": "this.AnimatedImageResource_604E1B5C_7AFA_E437_41B4_0327B36CE35A",
   "pitch": -1.69,
   "yaw": -169,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_69F07849_78F2_6E10_41DC_91E1F251D08C",
 "maps": [
  {
   "hfov": 4.71,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -169,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_1_HS_8_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -1.69
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Keluar Ruangan",
   "click": "this.startPanoramaWithCamera(this.panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE, this.camera_6D94F833_7CD8_7434_41DB_E3D68FD138DE); this.mainPlayList.set('selectedIndex', 12)"
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 6.19,
   "image": "this.AnimatedImageResource_6FCD3BB4_7AFA_E477_41D3_75BE56F45BE1",
   "pitch": 1.6,
   "yaw": -120.82,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_6C6545D5_78D1_E60E_41C1_10F1F7D504DF",
 "maps": [
  {
   "hfov": 6.19,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -120.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 1.6
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Keluar Ruangan",
   "click": "this.startPanoramaWithCamera(this.panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF, this.camera_6DD70809_7CD8_73D4_41B3_2B3FF51C14E0); this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 5.95,
   "image": "this.AnimatedImageResource_604EBB5D_7AFA_E431_41D4_132F3439362E",
   "pitch": 3.8,
   "yaw": -37.11,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_69E51227_78F1_E210_41C4_F01092A4CDA7",
 "maps": [
  {
   "hfov": 5.95,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -37.11,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 3.8
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "toolTip": "Keluar Ruangan Kelas",
   "click": "this.startPanoramaWithCamera(this.panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9, this.camera_6C7E97C6_7CD8_7C5C_41D5_C6EEB9A85AEE); this.mainPlayList.set('selectedIndex', 18)"
  }
 ],
 "data": {
  "label": "Circle Door 02"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 5.56,
   "image": "this.AnimatedImageResource_6FCCABB7_7AFA_E471_41D3_7FEE649EC619",
   "pitch": 2.97,
   "yaw": -79.39,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_6BC09CE0_7AA9_1BBB_41D8_EC4D4AA5296B",
 "maps": [
  {
   "hfov": 5.56,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -79.39,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 2.97
  }
 ]
},
{
 "propagateClick": true,
 "scrollBarWidth": 10,
 "id": "Container_6D9D9C39_7AD7_1C71_41B2_B10B24596706",
 "scrollBarColor": "#000000",
 "paddingRight": 0,
 "right": "0%",
 "paddingLeft": 0,
 "children": [
  "this.IconButton_6D9D8C39_7AD7_1C71_41DD_0AFF9FBDB2C2"
 ],
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "width": 110,
 "minHeight": 1,
 "horizontalAlign": "center",
 "verticalAlign": "middle",
 "scrollBarOpacity": 0.5,
 "layout": "horizontal",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "minWidth": 1,
 "height": 110,
 "top": "0%",
 "gap": 10,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "shadow": false,
 "paddingBottom": 0,
 "class": "Container",
 "borderRadius": 0,
 "overflow": "visible",
 "data": {
  "name": "button menu sup"
 }
},
{
 "propagateClick": true,
 "scrollBarWidth": 10,
 "id": "Container_6D9DBC39_7AD7_1C71_41BF_E78F003956ED",
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "paddingRight": 0,
 "right": "0%",
 "children": [
  "this.IconButton_6D9E5C39_7AD7_1C71_41D4_E258FB20908E",
  "this.IconButton_6D9E4C39_7AD7_1C71_41D3_2C94A336DB12",
  "this.IconButton_6D9E6C39_7AD7_1C71_4186_D67E1D42FBC6",
  "this.IconButton_6293F3CA_7AD6_E417_41D5_24A832F2C26B"
 ],
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "horizontalAlign": "center",
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "layout": "vertical",
 "bottom": "0%",
 "contentOpaque": false,
 "minWidth": 1,
 "scrollBarMargin": 2,
 "height": "85.959%",
 "width": "91.304%",
 "gap": 3,
 "paddingTop": 0,
 "shadow": false,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "visible": false,
 "class": "Container",
 "data": {
  "name": "-button set"
 },
 "overflow": "scroll"
},
{
 "scrollBarWidth": 10,
 "id": "Container_6D864BCE_7AAB_6413_41A4_C022E715813E",
 "left": "15%",
 "shadowVerticalLength": 0,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "paddingRight": 0,
 "right": "15%",
 "children": [
  "this.Container_6D867BCE_7AAB_6413_41DD_2C97E57FCB1F",
  "this.ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366"
 ],
 "shadowColor": "#000000",
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "horizontalAlign": "center",
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "layout": "vertical",
 "bottom": "7%",
 "contentOpaque": false,
 "minWidth": 1,
 "top": "7%",
 "scrollBarMargin": 2,
 "shadowBlurRadius": 25,
 "shadowSpread": 1,
 "gap": 10,
 "shadowHorizontalLength": 0,
 "paddingTop": 0,
 "shadowOpacity": 0.3,
 "shadow": true,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "class": "Container",
 "data": {
  "name": "Global"
 },
 "overflow": "visible",
 "propagateClick": false
},
{
 "class": "AnimatedImageResource",
 "rowCount": 3,
 "frameCount": 9,
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_604A1B5A_7AFA_E433_419E_79CE66A1B407",
 "levels": [
  {
   "url": "media/panorama_764DDDE7_78B6_6611_41C9_1C1119951A73_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 3,
 "frameCount": 9,
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_6FCE8BB6_7AFA_E473_41D2_749B87C5CE87",
 "levels": [
  {
   "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_6FCEABB6_7AFA_E473_41DD_E7468DB7F7B4",
 "levels": [
  {
   "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 800,
   "height": 1200
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_6FCECBB6_7AFA_E473_41DB_43D02794E12C",
 "levels": [
  {
   "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_6FCD0BB6_7AFA_E473_41D5_C466D0FECCB7",
 "levels": [
  {
   "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_1_HS_4_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_6FCD3BB6_7AFA_E473_41D0_D61AF7463057",
 "levels": [
  {
   "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_1_HS_6_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 3,
 "frameCount": 9,
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_6FCD7BB6_7AFA_E473_41D5_976F1E23819B",
 "levels": [
  {
   "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_1_HS_8_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_6FCD9BB7_7AFA_E471_41D2_DFB0F531B9D1",
 "levels": [
  {
   "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_1_HS_9_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_6216643B_7AB9_2C72_41CF_B64600BF37FC",
 "levels": [
  {
   "url": "media/panorama_71403DA3_7AAB_35BE_41A1_3EA080EB04E9_0_HS_11_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_6FCDDBB7_7AFA_E471_41CA_E61F8AD7FBE1",
 "levels": [
  {
   "url": "media/panorama_704658B7_7AAB_1B86_41D1_6C26F0478F8D_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 800,
   "height": 1200
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 3,
 "frameCount": 9,
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_60444B59_7AFA_E431_41DC_CF907C8F3A4A",
 "levels": [
  {
   "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_6044AB59_7AFA_E431_41D8_7ECA1EE71E19",
 "levels": [
  {
   "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 3,
 "frameCount": 9,
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_604B0B59_7AFA_E431_4184_0371B58EFD99",
 "levels": [
  {
   "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_604B8B59_7AFA_E431_41D9_B9A41E098E9E",
 "levels": [
  {
   "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0_HS_5_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_604BBB59_7AFA_E431_41DC_127A0BA272E7",
 "levels": [
  {
   "url": "media/panorama_723ED784_78AE_2210_41D7_240C3277B76A_0_HS_6_0.png",
   "class": "ImageResourceLevel",
   "width": 400,
   "height": 360
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_604F1B5B_7AFA_E431_41B4_FD5522A46E9D",
 "levels": [
  {
   "url": "media/panorama_764800C0_78AE_5E10_41D9_ADD7D25ED61E_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 800,
   "height": 1200
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_6048CB5B_7AFA_E431_41C5_F6E52ED2E4EA",
 "levels": [
  {
   "url": "media/panorama_76476A60_78AE_220F_41C1_0D6C949662F8_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 800,
   "height": 1200
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_6FCD7BB5_7AFA_E471_41C6_FA2E4F5BFA3E",
 "levels": [
  {
   "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 800,
   "height": 1200
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_6FCD9BB5_7AFA_E471_41B4_2BDF51ED57DF",
 "levels": [
  {
   "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_6FCDBBB5_7AFA_E471_41DE_7EED9810C37A",
 "levels": [
  {
   "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_6FCDDBB5_7AFA_E471_41DB_16D7D79D8BF8",
 "levels": [
  {
   "url": "media/panorama_696A774A_78F2_2210_41D6_DCA3CB63C911_1_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_6FCDFBB7_7AFA_E471_41DC_D8CCE915648F",
 "levels": [
  {
   "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 800,
   "height": 1200
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_6FCC1BB7_7AFA_E471_41CE_10F15005685C",
 "levels": [
  {
   "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_6FCC5BB7_7AFA_E471_41C2_AF0210F88A3B",
 "levels": [
  {
   "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_1_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 3,
 "frameCount": 9,
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_6FCC7BB7_7AFA_E471_41DA_4456C327947B",
 "levels": [
  {
   "url": "media/panorama_7041353F_7AAB_2A86_41DA_A9C3973503F9_1_HS_4_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_604E6B5D_7AFA_E431_41D6_7B0F5BBA47CB",
 "levels": [
  {
   "url": "media/panorama_6800B8E5_78FE_6E11_41D4_C7C820788D17_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 800,
   "height": 1200
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 3,
 "frameCount": 9,
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_77CAB0D6_78B2_DE30_41DB_E2EDCC801DB2",
 "levels": [
  {
   "url": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 3,
 "frameCount": 9,
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_6045FB58_7AFA_E43F_41C6_2C478EA2E50B",
 "levels": [
  {
   "url": "media/panorama_72061A5F_78AE_2230_41AA_47D0C4C4ECA8_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 3,
 "frameCount": 9,
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_77C870D4_78B2_DE30_41D5_A130E1AC6FC0",
 "levels": [
  {
   "url": "media/panorama_7393C9E2_78AE_6E13_41D8_10BD160FB61A_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_604D1B5D_7AFA_E431_41D6_880D3855463D",
 "levels": [
  {
   "url": "media/panorama_68238DD6_78FE_6630_41DA_C39A3B2415C5_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 800,
   "height": 1200
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_6FCD5BB5_7AFA_E471_41D5_52D072E7D116",
 "levels": [
  {
   "url": "media/panorama_69748DD6_78F2_2630_41AE_0D1AE9D947F4_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 800,
   "height": 1200
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_604D5B5D_7AFA_E431_41CA_E9AA42AC8503",
 "levels": [
  {
   "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 800,
   "height": 1200
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_604DFB5D_7AFA_E431_41DA_D4D959BEFDEF",
 "levels": [
  {
   "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_604C3B5D_7AFA_E431_41C8_0E29E28A0D3A",
 "levels": [
  {
   "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_1_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_604CAB5E_7AFA_E49D_41D7_0C1E8659743B",
 "levels": [
  {
   "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_1_HS_5_0.png",
   "class": "ImageResourceLevel",
   "width": 800,
   "height": 1200
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_6FCE9BB4_7AFA_E477_41D5_199F909A84F5",
 "levels": [
  {
   "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_1_HS_6_0.png",
   "class": "ImageResourceLevel",
   "width": 800,
   "height": 1200
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_6FCEBBB4_7AFA_E477_41BE_48A9C31EC308",
 "levels": [
  {
   "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_1_HS_7_0.png",
   "class": "ImageResourceLevel",
   "width": 420,
   "height": 330
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 3,
 "frameCount": 9,
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_6FCEDBB4_7AFA_E477_41DB_5B5E69671CD4",
 "levels": [
  {
   "url": "media/panorama_6BAF0679_78F2_E2F1_41DA_D39DA896F5EE_1_HS_8_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 3,
 "frameCount": 9,
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_60497B5A_7AFA_E433_41DE_149293761BE9",
 "levels": [
  {
   "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 3,
 "frameCount": 9,
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_6049AB5A_7AFA_E433_41D5_4DD0702D278D",
 "levels": [
  {
   "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_60481B5B_7AFA_E431_41DA_E8F9052D9435",
 "levels": [
  {
   "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 800,
   "height": 1200
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_60486B5B_7AFA_E431_41CB_DB24B8D8D296",
 "levels": [
  {
   "url": "media/panorama_77B07053_78AE_3E31_419D_A9556B1BF7AD_1_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 800,
   "height": 1200
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 3,
 "frameCount": 9,
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_604A5B5A_7AFA_E433_41AD_3331D8941413",
 "levels": [
  {
   "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_604AEB5A_7AFA_E433_41D9_9DADCF45D9CD",
 "levels": [
  {
   "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 3,
 "frameCount": 9,
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_60492B5A_7AFA_E433_41C0_84201A49BA1D",
 "levels": [
  {
   "url": "media/panorama_762A9352_78B2_2233_41B8_F280EC8EACA8_1_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 3,
 "frameCount": 9,
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_6049EB5B_7AFA_E431_41CA_90BE299BF5E0",
 "levels": [
  {
   "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_60482B5B_7AFA_E431_41DB_563A9AE03715",
 "levels": [
  {
   "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 800,
   "height": 1200
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_60488B5C_7AFA_E437_41D5_24B6F34495F5",
 "levels": [
  {
   "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 800,
   "height": 1200
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_6048DB5C_7AFA_E437_41DE_0CCCB7240A83",
 "levels": [
  {
   "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_1_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_604F4B5C_7AFA_E437_41B7_9F7BC069FFC1",
 "levels": [
  {
   "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_1_HS_5_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 690
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 3,
 "frameCount": 9,
 "frameDuration": 62,
 "colCount": 3,
 "id": "AnimatedImageResource_604FBB5C_7AFA_E437_41CB_F69D9DF1FE37",
 "levels": [
  {
   "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_1_HS_7_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_604E1B5C_7AFA_E437_41B4_0327B36CE35A",
 "levels": [
  {
   "url": "media/panorama_68F5945E_78D3_E630_41DC_748EA0D8DACF_1_HS_8_0.png",
   "class": "ImageResourceLevel",
   "width": 800,
   "height": 1200
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_6FCD3BB4_7AFA_E477_41D3_75BE56F45BE1",
 "levels": [
  {
   "url": "media/panorama_6963F3F1_78F2_21F1_41B6_8BDEA82BF567_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 800,
   "height": 1200
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_604EBB5D_7AFA_E431_41D4_132F3439362E",
 "levels": [
  {
   "url": "media/panorama_68DC23CF_78FE_2210_41D7_C5F5AE9000F2_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 800,
   "height": 1200
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_6FCCABB7_7AFA_E471_41D3_7FEE649EC619",
 "levels": [
  {
   "url": "media/panorama_750F69F4_7AA9_7D9A_41DC_E65BBAB678EE_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 800,
   "height": 1200
  }
 ]
},
{
 "transparencyActive": true,
 "maxHeight": 60,
 "propagateClick": true,
 "id": "IconButton_6D9D8C39_7AD7_1C71_41DD_0AFF9FBDB2C2",
 "paddingRight": 0,
 "paddingLeft": 0,
 "borderSize": 0,
 "width": 60,
 "minHeight": 1,
 "horizontalAlign": "center",
 "verticalAlign": "middle",
 "iconURL": "skin/IconButton_6D9D8C39_7AD7_1C71_41DD_0AFF9FBDB2C2.png",
 "pressedRollOverIconURL": "skin/IconButton_6D9D8C39_7AD7_1C71_41DD_0AFF9FBDB2C2_pressed_rollover.png",
 "minWidth": 1,
 "mode": "toggle",
 "click": "if(!this.Container_6D9DBC39_7AD7_1C71_41BF_E78F003956ED.get('visible')){ this.setComponentVisibility(this.Container_6D9DBC39_7AD7_1C71_41BF_E78F003956ED, true, 0, null, null, false) } else { this.setComponentVisibility(this.Container_6D9DBC39_7AD7_1C71_41BF_E78F003956ED, false, 0, null, null, false) }",
 "height": 60,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "shadow": false,
 "paddingBottom": 0,
 "class": "IconButton",
 "borderRadius": 0,
 "pressedIconURL": "skin/IconButton_6D9D8C39_7AD7_1C71_41DD_0AFF9FBDB2C2_pressed.png",
 "cursor": "hand",
 "maxWidth": 60,
 "data": {
  "name": "image button menu"
 }
},
{
 "transparencyActive": false,
 "maxHeight": 512,
 "propagateClick": false,
 "id": "IconButton_6293F3CA_7AD6_E417_41D5_24A832F2C26B",
 "paddingRight": 0,
 "paddingLeft": 0,
 "borderSize": 0,
 "width": 49.5,
 "minHeight": 1,
 "horizontalAlign": "center",
 "verticalAlign": "middle",
 "iconURL": "skin/IconButton_6293F3CA_7AD6_E417_41D5_24A832F2C26B.png",
 "minWidth": 1,
 "mode": "push",
 "click": "if(!this.Container_6D862BCE_7AAB_6413_41DB_1DFD9CCEEEE5.get('visible')){ this.setComponentVisibility(this.Container_6D862BCE_7AAB_6413_41DB_1DFD9CCEEEE5, true, 0, null, null, false) } else { this.setComponentVisibility(this.Container_6D862BCE_7AAB_6413_41DB_1DFD9CCEEEE5, false, 0, null, null, false) }",
 "height": 56.8,
 "paddingTop": 0,
 "backgroundOpacity": 0,
 "shadow": false,
 "paddingBottom": 0,
 "class": "IconButton",
 "borderRadius": 0,
 "cursor": "hand",
 "maxWidth": 512,
 "data": {
  "name": "IconButton38188"
 }
},
{
 "backgroundColorRatios": [
  0,
  0.25,
  0.97,
  1
 ],
 "scrollBarWidth": 10,
 "id": "Container_6D867BCE_7AAB_6413_41DD_2C97E57FCB1F",
 "propagateClick": false,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "paddingRight": 0,
 "children": [
  "this.HTMLText_6D866BCE_7AAB_6413_41C5_644E92F42AA6",
  "this.IconButton_6D861BCE_7AAB_6413_41BF_62A3E27E23B2"
 ],
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "backgroundColorDirection": "vertical",
 "verticalAlign": "top",
 "scrollBarOpacity": 0.54,
 "layout": "absolute",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minWidth": 1,
 "horizontalAlign": "left",
 "width": "100%",
 "gap": 10,
 "height": 140,
 "paddingTop": 0,
 "shadow": false,
 "paddingBottom": 0,
 "backgroundOpacity": 0.34,
 "borderRadius": 0,
 "class": "Container",
 "data": {
  "name": "header"
 },
 "overflow": "scroll"
},
{
 "scrollBarWidth": 10,
 "selectedItemBackgroundColorRatios": [],
 "id": "ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366",
 "itemLabelFontStyle": "normal",
 "paddingLeft": 70,
 "scrollBarColor": "#000000",
 "horizontalAlign": "center",
 "itemLabelHorizontalAlign": "center",
 "itemMode": "normal",
 "scrollBarVisible": "rollOver",
 "rollOverItemThumbnailShadowColor": "#04A3E1",
 "scrollBarOpacity": 0.43,
 "itemPaddingRight": 3,
 "itemMaxHeight": 1000,
 "itemThumbnailOpacity": 1,
 "minHeight": 1,
 "verticalAlign": "top",
 "width": "100%",
 "selectedItemThumbnailShadowBlurRadius": 16,
 "itemBorderRadius": 0,
 "itemLabelFontFamily": "Arial Rounded MT Bold",
 "minWidth": 1,
 "itemPaddingLeft": 3,
 "itemMaxWidth": 1000,
 "itemHorizontalAlign": "center",
 "itemLabelPosition": "bottom",
 "height": "100%",
 "rollOverItemThumbnailShadowBlurRadius": 0,
 "selectedItemLabelFontColor": "#000000",
 "itemOpacity": 1,
 "itemBackgroundOpacity": 0,
 "backgroundOpacity": 0,
 "shadow": false,
 "class": "ThumbnailGrid",
 "itemPaddingTop": 3,
 "selectedItemBorderSize": 0,
 "selectedItemThumbnailShadowVerticalLength": 0,
 "itemBackgroundColor": [],
 "itemBackgroundColorRatios": [],
 "itemThumbnailBorderRadius": 0,
 "propagateClick": false,
 "itemWidth": 220,
 "selectedItemBackgroundColor": [],
 "selectedItemThumbnailShadow": true,
 "paddingRight": 70,
 "itemMinHeight": 50,
 "borderSize": 0,
 "selectedItemLabelFontSize": "20px",
 "selectedItemThumbnailShadowHorizontalLength": 0,
 "selectedItemLabelFontWeight": "bold",
 "itemLabelFontWeight": "bold",
 "itemLabelTextDecoration": "none",
 "rollOverItemLabelFontColor": "#04A3E1",
 "rollOverItemThumbnailShadow": true,
 "playList": "this.ThumbnailGrid_6D860BCE_7AAB_6413_419C_7531C8B1E366_playlist",
 "scrollBarMargin": 2,
 "itemLabelFontSize": "20px",
 "itemMinWidth": 50,
 "itemThumbnailScaleMode": "fit_outside",
 "itemVerticalAlign": "top",
 "itemLabelFontColor": "#FFFFFF",
 "itemHeight": 156,
 "gap": 26,
 "rollOverItemThumbnailShadowVerticalLength": 0,
 "itemBackgroundColorDirection": "vertical",
 "itemThumbnailHeight": 122,
 "paddingTop": 10,
 "itemThumbnailShadow": false,
 "paddingBottom": 70,
 "borderRadius": 5,
 "itemPaddingBottom": 3,
 "rollOverItemThumbnailShadowHorizontalLength": 8,
 "itemLabelGap": 6,
 "data": {
  "name": "ThumbnailList"
 },
 "itemThumbnailWidth": 220
},
{
 "propagateClick": false,
 "scrollBarWidth": 10,
 "id": "HTMLText_6D866BCE_7AAB_6413_41C5_644E92F42AA6",
 "left": "0%",
 "paddingLeft": 80,
 "scrollBarColor": "#000000",
 "paddingRight": 0,
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 100,
 "top": "0%",
 "scrollBarOpacity": 0.5,
 "scrollBarMargin": 2,
 "minWidth": 1,
 "height": "100%",
 "width": "77.115%",
 "paddingTop": 0,
 "shadow": false,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "class": "HTMLText",
 "data": {
  "name": "HTMLText54192"
 },
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:5.33vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:5.43vh;font-family:'Bebas Neue Bold';\">Panorama list:</SPAN></SPAN></DIV></div>"
},
{
 "transparencyActive": false,
 "maxHeight": 60,
 "propagateClick": false,
 "id": "IconButton_6D861BCE_7AAB_6413_41BF_62A3E27E23B2",
 "paddingRight": 0,
 "right": 20,
 "paddingLeft": 0,
 "borderSize": 0,
 "minHeight": 50,
 "horizontalAlign": "right",
 "verticalAlign": "top",
 "iconURL": "skin/IconButton_6D861BCE_7AAB_6413_41BF_62A3E27E23B2.jpg",
 "pressedRollOverIconURL": "skin/IconButton_6D861BCE_7AAB_6413_41BF_62A3E27E23B2_pressed_rollover.jpg",
 "mode": "push",
 "minWidth": 50,
 "click": "this.setComponentVisibility(this.Container_6D862BCE_7AAB_6413_41DB_1DFD9CCEEEE5, false, 0, null, null, false)",
 "height": "36.14%",
 "width": "100%",
 "top": 20,
 "rollOverIconURL": "skin/IconButton_6D861BCE_7AAB_6413_41BF_62A3E27E23B2_rollover.jpg",
 "paddingTop": 0,
 "shadow": false,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "pressedIconURL": "skin/IconButton_6D861BCE_7AAB_6413_41BF_62A3E27E23B2_pressed.jpg",
 "class": "IconButton",
 "data": {
  "name": "IconButton X"
 },
 "cursor": "hand",
 "maxWidth": 60
}],
 "width": "100%"
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();

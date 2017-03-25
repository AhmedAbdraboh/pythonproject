/* eslint-disable max-len */
/* Functions to handle login & registration modal*/
function msgChange($divTag, $iconTag, $textTag, $divClass, $iconClass, $msgText) {
    var $msgOld = $divTag.text();
    msgFade($textTag, $msgText);
    $divTag.addClass($divClass);
    $iconTag.removeClass('glyphicon-chevron-right');
    $iconTag.addClass($iconClass + ' ' + $divClass);
    setTimeout(function() {
        msgFade($textTag, $msgOld);
        $divTag.removeClass($divClass);
        $iconTag.addClass('glyphicon-chevron-right');
        $iconTag.removeClass($iconClass + ' ' + $divClass);
    }, $msgShowTime);
}

myUserName = "";
function modalAnimate($oldForm, $newForm) {
    var $oldH = $oldForm.height();
    var $newH = $newForm.height();
    $divForms.css('height', $oldH);
    $oldForm.fadeToggle($modalAnimateTime, function() {
        $divForms.animate({
            height: $newH,
        }, $modalAnimateTime, function() {
            $newForm.fadeToggle($modalAnimateTime);
        });
    });
}

function msgFade($msgId, $msgText) {
    $msgId.fadeOut($msgAnimateTime, function() {
        $(this).text($msgText).fadeIn($msgAnimateTime);
    });
}
/*Template for new tabs*/
tabTemplate = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>"
tabCounter = 2;
function addTab(label, bodyTemplate) {
    id = "tabs-" + tabCounter;
    li = $( tabTemplate.replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ) );
    tabs = $( "#tabs" );
    tabs.find( ".ui-tabs-nav" ).append( li );
    tabs.append( "<div id='" + id + "'>" + bodyTemplate + "</div>" );
    tabs.tabs( "refresh" );
    tabCounter++;
}
$(function() {
    /* Open a socket */
    chatWebSocket = new WebSocket("ws://192.168.43.172:7500/ws");
    /*modal handling*/
    $formLogin = $('#login-form');
    $formLost = $('#lost-form');
    $formRegister = $('#register-form');
    $divForms = $('#div-forms');
    $modalAnimateTime = 300;
    $msgAnimateTime = 150;
    $msgShowTime = 2000;
    $( "#tabs" ).on( "click", "span.ui-icon-close", function() {
      var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
      $( "#" + panelId ).remove();
      tabs.tabs( "refresh" );
    });
    $("#tabs").on('click', function() {
      clickedItem = event.target
      if ($(clickedItem).hasClass('btn-success')) {
        if ($(clickedItem).hasClass('group-chat-class')) {
          chatMessage = {"type": "groupChatMessage",
                         "groupName": $(clickedItem).attr('id'),
                         "message": $(clickedItem).parent().prev().children(':eq(0)').val(),
                        }
        } else if ($(clickedItem).hasClass('private-chat-class')) {
          chatMessage = {"type": "privateChatMessage",
                         "receiver": $(clickedItem).attr('id'),
                         "message": $(clickedItem).parent().prev().children(':eq(0)').val(),
                        }
        }
        //console.log(chatMessage);
        chatWebSocket.send(JSON.stringify(chatMessage))
      }
      if ($(clickedItem).parent().hasClass('userListClass')) {
        singleChatTemplate = '<div class="row"><div class="col-sm-12"><div id="' + $(event.target).text() + '" class="panel panel-default" style="text-align: left; height: 300px; overflow-y: scroll"><div class="panel-body"></div></div></div></div><div class="row"><div class="col-sm-10"><textarea class="form-control" rows="2" style="border-radius: 5px;"></textarea></div><div class="col-sm-2"><div id="' + $(event.target).text() + '" class="private-chat-class btn btn-success btn-large" style="border-radius: 5px;">Send</div></div></div>'
        addTab($(event.target).text(), singleChatTemplate);
      }
    });
    $('#groupsPanel').on('click', 'img', function(event) {
      //console.log($(event.target).next().next().text());
      chatRoomRequest = {"type": "chatWithGroup", "groupName": $(event.target).next().next().text()}
      chatWebSocket.send(JSON.stringify(chatRoomRequest));
    });
    $('#othergroupsPanel').on('click', 'img', function(event) {
      //console.log($(event.target).next().next().text());
      joinGroupRequest = {"type": "joinGroup", "groupName": $(event.target).next().next().text()}
      chatWebSocket.send(JSON.stringify(joinGroupRequest));
    });
    $('#otherPeoplePanel').on('click', 'img', function(event) {
      //console.log($(event.target).next().next().text());
      friendRequest = {"type": "friendRequest", "friendName": $(event.target).next().next().text()}
      //console.log(friendRequest);
      chatWebSocket.send(JSON.stringify(friendRequest));
    });
    $('form').submit(function() {
        switch (this.id) {
            case 'login-form':
                $lg_username = $('#login_username').val();
                $lg_password = $('#login_password').val();
                loginRequest = {"type": "login", "userName": $lg_username, "password": $lg_password}
                //console.log(loginRequest);
                chatWebSocket.send(JSON.stringify(loginRequest));
                // if ($lg_username == 'ERROR') {} else {}
                return false;
                break;
            case 'lost-form':
                $ls_email = $('#lost_email').val();
                if ($ls_email == 'ERROR') {
                    msgChange($('#div-lost-msg'), $('#icon-lost-msg'), $('#text-lost-msg'), 'error', 'glyphicon-remove', 'Send error');
                } else {
                    msgChange($('#div-lost-msg'), $('#icon-lost-msg'), $('#text-lost-msg'), 'success', 'glyphicon-ok', 'Send OK');
                }
                return false;
                break;
            case 'register-form':
                var $rg_username = $('#register_username').val();
                // var $rg_email = $('#register_email').val();
                var $rg_password = $('#register_password').val();
                registerationRequest = {"type": "register", "userName": $rg_username, "password": $rg_password}
                // console.log(registerationRequest);
                chatWebSocket.send(JSON.stringify(registerationRequest));
                // if ($rg_username == 'ERROR') {
                //     msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), 'error', 'glyphicon-remove', 'Register error');
                // } else {
                //     msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), 'success', 'glyphicon-ok', 'Register OK');
                // }
                return false;
                break;
            default:
                return false;
        }
        return false;
    });
    $('#login_register_btn').click(function() {
        modalAnimate($formLogin, $formRegister);
    });
    $('#register_login_btn').click(function() {
        modalAnimate($formRegister, $formLogin);
    });
    $('#login_lost_btn').click(function() {
        modalAnimate($formLogin, $formLost);
    });
    $('#lost_login_btn').click(function() {
        modalAnimate($formLost, $formLogin);
    });
    $('#lost_register_btn').click(function() {
        modalAnimate($formLost, $formRegister);
    });
    $('#register_lost_btn').click(function() {
        modalAnimate($formRegister, $formLost);
    });
    $('#closeButton').on('click', function() {
        // window.close();
        // $('#login-modal').modal('hide');
    });
    $('#createGroupButton').on('click', function(){
      swal({
        title: "Create Group",
        text: "Write Group Name:",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: true,
        animation: "slide-from-top",
        inputPlaceholder: "Write something"
      },
      function(inputValue){
        if (inputValue === false) return false;

        if (inputValue === "") {
          swal.showInputError("You need to write something!");
          return false
        }
        createGroupRequest = {"type":"createGroup", "groupName":inputValue};
        // console.log(createGroupRequest);
        chatWebSocket.send(JSON.stringify(createGroupRequest));
        setTimeout(function(){$('li.active:eq(0)').trigger('click');}, 250);
      });
    })
    /* Listen to server messages*/
    chatWebSocket.onmessage=function(e){
      serverMessage = JSON.parse(e.data);
      // console.log(serverMessage);
      switch (serverMessage.type) {
        case 'authentication':
          if (serverMessage.status == 'success') {
            msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), 'success', 'glyphicon-ok', 'Logged In');
            setTimeout(function(){$('#closeButton').trigger('click')}, 1500)
            myUserName = $lg_username;
          } else {
            msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), 'error', 'glyphicon-remove', 'Login error');
          }
          break;
        case 'registration':
          if (serverMessage.status == 'success') {
            msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), 'success', 'glyphicon-ok', 'Registeration OK, Please Log In');
          } else {
            msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), 'error', 'glyphicon-remove', 'Registeration error');
          }
          break;
        case 'leaderBoard':
            $('#partyManHeading').text(serverMessage.partyMan)
            $('#chattyOneHeading').text(serverMessage.chattyOne)
            $('#superFriendHeading').text(serverMessage.superFriend)
            $('#publicFigureHeading').text(serverMessage.publicFigure)
          break;
        case 'groups':
          $('#groupsPanel').children().remove();
          for (var i = 0; i < serverMessage.myGroups.length; i++) {
            groupIcon = '<div style="text-align: center;display: inline-block"><img height="75px" class="img img-circle" src="static/chatGroup.png")}}"><br><span>'+ serverMessage.myGroups[i] +'</span></div>'
            $('#groupsPanel').append(groupIcon);
          }
          $('#othergroupsPanel').children().remove();
          for (var i = 0; i < serverMessage.notMyGroups.length; i++) {
            groupIcon = '<div style="text-align: center;display: inline-block"><img height="75px" class="img img-circle" src="static/chatGroup.png")}}"><br><span>'+ serverMessage.notMyGroups[i] +'</span></div>'
            $('#othergroupsPanel').append(groupIcon);
          }
          break
        case 'people':
          $('#friendsPanel').children().remove();
          for (var i = 0; i < serverMessage.myFriends.length; i++) {
            friendIcon = '<div style="text-align: center;display: inline-block"><img height="75px" class="img img-circle" src="static/friend.png")}}"><br><span>'+ serverMessage.myFriends[i] +'</span></div>'
            $('#friendsPanel').append(friendIcon);
          }
          $('#otherPeoplePanel').children().remove();
          for (var i = 0; i < serverMessage.notMyFriends.length; i++) {
            friendIcon = '<div style="text-align: center;display: inline-block"><img height="75px" class="img img-circle" src="static/friend.png")}}"><br><span>'+ serverMessage.notMyFriends[i] +'</span></div>'
            $('#otherPeoplePanel').append(friendIcon);
          }
          break
        case 'groupChatStart':
          groupChatTemplate = '<div class="row"><div class="col-sm-9"><div id="' + chatRoomRequest.groupName + '" class="panel panel-default" style="text-align: left; height: 300px; overflow-y: scroll"><div class="panel-body"></div></div></div><div class="col-sm-3"><div class="panel panel-default" style="text-align: left; height: 300px; overflow-y:scroll"><div class="panel-body"><ul id="' + chatRoomRequest.groupName + '" class="userListClass" style="list-style-type: none; padding-left: 0;"></ul></div></div></div></div><div class="row"><div class="col-sm-10"><textarea class="form-control" rows="2" style="border-radius: 5px;"></textarea></div><div class="col-sm-2"><div id="' + chatRoomRequest.groupName + '" class=" group-chat-class btn btn-success btn-large" style="border-radius: 5px;">Send</div></div></div>'
          $('#chatsButton').trigger('click')
          addTab(chatRoomRequest.groupName, groupChatTemplate)
          $('#tabs a:last').trigger('click')
          for (var i = 0; i < serverMessage.onlineGroupMembers.length; i++) {
            if (serverMessage.onlineGroupMembers[i] == myUserName) {
              continue;
            }
            newLI = '<li>' + serverMessage.onlineGroupMembers[i] + '</li>'
            $('#tabs ul:last').append(newLI);
          }
          $('#chatsButton').addClass('active').siblings().removeClass('active');
          break
        case 'groupChatMessage':
          $('#' + serverMessage.groupName).filter('.panel').append('<span>' + serverMessage.sender + ': ' + serverMessage.message + '</span><br/>')
          break
        case 'privateChatMessage':
          if (serverMessage.sender == myUserName ) {
            // console.log('if');
            $('#' + serverMessage.receiver).filter('.panel').append('<span>' + serverMessage.sender + ': ' + serverMessage.message + '</span><br/>');
          } else {
            // console.log('else');
            $('#' + serverMessage.sender ).filter('.panel').append('<span>' + serverMessage.sender + ': ' + serverMessage.message + '</span><br/>')
          }
          break
        case 'userSignedIn':
          for (var i = 0; i < serverMessage.userGroups.length; i++) {
            $('ul').filter('#' + serverMessage.userGroups[i]).append('<li>' + serverMessage.userName + '</li>')
          }
          break
        case 'userSignedOut':
          $('li:contains("' + serverMessage.userName + '")').remove();
          break
        case 'joinGroupReply':
          if (serverMessage.status == "success") {
            $('div > span:contains("' + serverMessage.groupName + '")').parent().remove();
            groupIcon = '<div style="text-align: center;display: inline-block"><img height="75px" class="img img-circle" src="static/chatGroup.png")}}"><br><span>'+ serverMessage.groupName +'</span></div>'
            $('#groupsPanel').append(groupIcon);
          }
          break
        case 'friendRequestReply':
          if (serverMessage.status == "success") {
            $('div > span:contains("' + serverMessage.friendName + '")').parent().remove();
            friendIcon = '<div style="text-align: center;display: inline-block"><img height="75px" class="img img-circle" src="static/friend.png")}}"><br><span>'+ serverMessage.friendName +'</span></div>'
            $('#friendsPanel').append(friendIcon);
          }
          break
      }
    }
    /* Initialize jQuery UI Tabs Plugin */
    $( '#tabs' ).tabs({
        /*  All panels will be set to the height of the tallest panel */
        heightStyle: 'auto',
    });
    /* Get the  screen-reader span*/
    NavBarSRSpan = $('.sr-only:contains("(current)")');
    /* Event handler for the Navigation bar links*/
    $('ul:eq(0)').on('click', 'li', function(event) {
        /** Handle The Navaigation Bar **/
        /* Append the screen-reader span to the clicked item */
        $(event.target).append(NavBarSRSpan);
        /* Remove the 'Active' class from the previously active list item */
        $(event.target).parent().siblings('.active').removeClass('active');
        /* Add the 'Active' Class to the clicked item */
        $(event.target).parent().addClass('active');
        /** Handle The Content **/
        clickedNavLinkText = $(event.target).text();
        if (clickedNavLinkText.startsWith('Home')) {
            $('#home-container').removeClass('my-hidden-class').siblings(':not(:eq(0))').addClass('my-hidden-class');
        } else if (clickedNavLinkText.startsWith('Groups')) {
            $('#groups-container').removeClass('my-hidden-class').siblings(':not(:eq(0))').addClass('my-hidden-class');
            groupsRequest = {"type": "requestGroups"};
            // console.log(groupsRequest);
            chatWebSocket.send(JSON.stringify(groupsRequest));
        } else if (clickedNavLinkText.startsWith('People')) {
            $('#people-container').removeClass('my-hidden-class').siblings(':not(:eq(0))').addClass('my-hidden-class');
            peopleRequest = {"type": "requestPeople"};
            // console.log(peopleRequest);
            chatWebSocket.send(JSON.stringify(peopleRequest));
        } else if (clickedNavLinkText.startsWith('Chats')) {
            $('#chat-windows-container').removeClass('my-hidden-class').siblings(':not(:eq(0))').addClass('my-hidden-class');
        }
    });
    /* Event handler for the Log Out button*/
    $('ul:eq(1)').on('click', 'li', function(event) {
      /* Just reload the Application*/
      if ($(event.target).text() == 'Log out') {
        location.reload();
      }
    });
});

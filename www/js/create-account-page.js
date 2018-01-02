var createContent = `
<div data-page="create-account-screen" class="page no-navbar no-toolbar no-swipeback">
    <div class="page-content login-screen-content layout-white">
    <img src="css/logo.png" class="center" style="width: 60%; margin-top: 50px"/>
    <div class="login-screen-title" style="color: white; font-weight: lighter; letter-spacing: 2px;">Create Account</div>

    <form>
      
      <div class="list-block inset" style="padding: 0 20px; margin: auto; opacity: 0.5;">
        <ul style="border-radius: 5px;">
          <li class="item-content">
            <div class="item-media"><i class="icon f7-icons size-18">person</i></div>
            <div class="item-inner">
              <div class="item-input">
                <input type="text" id="new-name" placeholder="Name" />
              </div>
            </div>
          </li>
        </ul>
      </div>
      
      
      <div class="list-block inset" style="padding: 20px; margin: auto; opacity: 0.5;">
        <ul style="border-radius: 5px;">
          <li class="item-content">
            <div class="item-media"><i class="icon f7-icons size-18">email</i></div>
            <div class="item-inner">
              <div class="item-input">
                <input type="text" id="new-email"  placeholder="Email" />
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="list-block inset" style="padding: 0 20px; margin: auto; opacity: 0.5;">
        <ul style="border-radius: 5px;">
          <li class="item-content">
            <div class="item-media"><i class="icon f7-icons size-18">lock</i></div>
            <div class="item-inner">
              <div class="item-input">
                <input type="password" id="new-password" placeholder="Password" />
              </div>
            </div>
          </li>
        </ul>
      </div>
      
      <div class="list-block inset" style="padding: 20px 20px 0px 20px; margin: auto; opacity: 0.5;">
        <ul style="border-radius: 5px;">
          <li class="item-content">
            <div class="item-media"><i class="icon f7-icons size-18">lock</i></div>
            <div class="item-inner">
              <div class="item-input">
                <input type="password" id="confirm-password" placeholder="Confirm Password" />
              </div>
            </div>
          </li>
        </ul>
      </div>
      
      
        <div class="content-block inset">
        <p><a href="#" style="margin: 5px;" onclick="handleSignUp()" class="item-link button button-big color-white">Create Account</a></p>
      </div>
      
      <div style="text-align: center;">
        <p><a class="center-white" onclick="cancelNewAccount();" style="margin: 5px;" href="#">Cancel</a></p>
      </div>
     
    </form>
  </div>
</div>`

var createAuthScreen = `
<div data-page="authorization-screen" class="page no-navbar no-toolbar no-swipeback">
    <div class="page-content login-screen-content layout-white">
    <img src="css/logo.png" class="center" style="width: 60%; margin-top: 50px"/>
    <div class="login-screen-title animated fadeInRight" style="color: white; font-weight: lighter; letter-spacing: 2px;">Account Authorization</div>

    
        <div class="content-block inset animated fadeInUp">
          <div style="color: white; font-size: larger; margin: 10px;">
          <p>Please check your email and verify your email address to continue.</p>
          </div>
      
        <p><a href="#" style="margin: 5px;" onclick="continueIndex();" class="item-link button button-big color-white">Continue</a></p>
        <p><a href="#" style="margin: 5px;" onclick="sendEmailVerification()"  class="item-link button button-big color-white">Resend Authorization Link</a></p>

      </div>
  </div>
</div>
`
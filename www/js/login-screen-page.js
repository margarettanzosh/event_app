var createLogin = `

    <div data-page="login-screen" class="page no-navbar no-toolbar no-swipeback">
      <div class="page-content login-screen-content layout-white">
        <img src="css/logo.png" class="center" style="width: 60%; margin-top: 50px" />
        <div class="login-screen-title" style="color: white; font-weight: lighter; letter-spacing: 2px;">Event Tracker</div>

        <form>
          <div class="list-block inset" style="padding: 0 20px; margin: auto; opacity: 0.5;">
            <ul style="border-radius: 5px;" class="center">
              <li class="item-content">
                <div class="item-media"><i class="icon f7-icons size-18">email</i></div>
                <div class="item-inner">
                  <div class="item-input">
                    <input type="text" id="email" name="username" placeholder="Email" />
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
                    <input type="password" id="password" name="password" placeholder="Password" />
                  </div>



                </div>
              </li>
            </ul>

          </div>
          <div class="content-block inset">
            <p><a href="#" id="quickstart-sign-in" style="margin: 0 5px;" onclick="toggleSignIn()" class="item-link button button-big color-white">Login</a></p>
          </div>
          <div style="text-align: center;">
            <p><a class="center-white" style="margin: 5px;" onclick="sendPasswordReset();" href="#">Forgot Password?</a></p>
          </div>
          <div class="list-block">
            
              <div style="text-align: center; margin-top: 100px">
                <a href="#" onclick="signUp();" style="margin: 5px;" class="center-white">No account? <strong>Sign Up</strong></a></p>
              </div>
          </form>
        </div>
      </div>
`
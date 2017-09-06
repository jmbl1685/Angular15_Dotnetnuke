using DotNetNuke.Entities.Users;
using DotNetNuke.Services.Tokens;
using System;
using System.Web;
using System.Web.UI;

namespace Kitchensink.Core.DotNetNuke.Base
{
    internal class SessionPropertyAccess : JsonPropertyAccess<SessionDto>
    {
        private readonly Page _page;

        public SessionPropertyAccess(Page page)
        {
            _page = page;
        }

        protected override string ProcessToken(SessionDto model, UserInfo accessingUser, Scope accessLevel)
        {
            //global::DotNetNuke.Services.Exceptions.Exceptions.LogException(new ArgumentException(string.Format("Session {0}", HttpContext.Current.Session[model.KeyName])));
            return Convert.ToString(HttpContext.Current.Session[model.KeyName]);
        }
    }
}

using DotNetNuke.Entities.Users;
using DotNetNuke.Services.Tokens;
using Kitchensink.Core.DotNetNuke.Extensions;
using Newtonsoft.Json;
using System.Web.UI;

namespace Kitchensink.Core.DotNetNuke.Base
{
    internal class CurrentUserPropertyAccess : JsonPropertyAccess<UserDto>
    {
        private readonly Page _page;

        public CurrentUserPropertyAccess(Page page)
        {
            _page = page;
        }

        protected override string ProcessToken(UserDto model, UserInfo accessingUser, Scope accessLevel)
        {
            var user = UserController.Instance.GetCurrentUserInfo();
            var currentUser = user.MapToCurrentUser();
            return JsonConvert.SerializeObject(currentUser);
        }
    }
}

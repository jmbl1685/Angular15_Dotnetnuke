using DotNetNuke.Entities.Users;
using DotNetNuke.Services.Tokens;
using System;
using System.Web.UI;

namespace Kitchensink.Core.DotNetNuke.Base
{
    internal class IsInRolePropertyAccess : JsonPropertyAccess<IsInRoleDto>
    {
        private readonly Page _page;

        public IsInRolePropertyAccess(Page page)
        {
            _page = page;
        }

        protected override string ProcessToken(IsInRoleDto model, UserInfo accessingUser, Scope accessLevel)
        {
            var userInfo = UserController.Instance.GetCurrentUserInfo();
            var isInRole = userInfo.IsInRole(model.Name);
            var asString = isInRole ? Boolean.TrueString : Boolean.FalseString;
            return asString;
        }
    }
}

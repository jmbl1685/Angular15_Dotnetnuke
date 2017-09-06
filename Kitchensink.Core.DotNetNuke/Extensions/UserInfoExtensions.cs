using DotNetNuke.Entities.Users;
using Kitchensink.Core.DotNetNuke.Base;
using System.Linq;

namespace Kitchensink.Core.DotNetNuke.Extensions
{
    internal static class UserInfoExtensions
    {
        public static CurrentUser MapToCurrentUser(this UserInfo self)
        {
            return new CurrentUser
            {
                UserId = self.UserID,
                PortalId = self.PortalID,
                DisplayName = self.DisplayName,
                FirstName = self.FirstName,
                LastName = self.LastName,
                UserName = self.Username,
                Email = self.Email,
                IsSuperUser = self.IsSuperUser,
                Roles = self.Roles.Select(T => T.ToUpper()).ToList()
            };
        }
    }
}

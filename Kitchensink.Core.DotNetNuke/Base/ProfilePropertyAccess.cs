using DotNetNuke.Entities.Users;
using DotNetNuke.Services.Tokens;

namespace Kitchensink.Core.DotNetNuke.Base
{
    public class ProfilePropertyAccess : JsonPropertyAccess<ProfileDto>
    {
        protected override string ProcessToken(ProfileDto model, UserInfo accessingUser, Scope accessLevel)
        {
            var userInfo = UserController.Instance.GetCurrentUserInfo();
            var property = userInfo.Profile.ProfileProperties.GetByName(model.PropertyName);
            return property.PropertyValue;
        }
    }
}

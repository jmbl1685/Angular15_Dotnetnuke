using DotNetNuke.Entities.Users;
using DotNetNuke.Services.Tokens;
using Newtonsoft.Json;
using System.Configuration;
using System.Web.UI;

namespace Kitchensink.Core.DotNetNuke.Base
{
    internal class SettingConfigPropertyAccess : JsonPropertyAccess<SettingConfigDto>
    {
        private readonly Page _page;

        public SettingConfigPropertyAccess(Page page)
        {
            _page = page;
        }

        protected override string ProcessToken(SettingConfigDto model, UserInfo accessingUser, Scope accessLevel)
        {
            return ConfigurationManager.AppSettings[model.KeyName];
        }
    }
}

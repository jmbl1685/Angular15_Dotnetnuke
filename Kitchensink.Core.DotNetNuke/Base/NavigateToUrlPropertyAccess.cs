using DotNetNuke.Entities.Portals;
using DotNetNuke.Entities.Users;
using DotNetNuke.Services.Tokens;
using Kitchensink.Core.DotNetNuke.Extensions;
using System.Web.UI;

namespace Kitchensink.Core.DotNetNuke.Base
{
    internal class NavigateToUrlPropertyAccess : JsonPropertyAccess<NavigateToUrlDto>
    {
        private readonly Page _page;

        public NavigateToUrlPropertyAccess(Page page)
        {
            _page = page;
        }

        protected override string ProcessToken(NavigateToUrlDto model, UserInfo accessingUser, Scope accessLevel)
        {
            var portalId = PortalController.Instance.GetCurrentPortalSettings().PortalId;
            var controlKeyName = string.IsNullOrEmpty(model.ControlKeyName) ? "" : model.ControlKeyName;
            var url = PortalExtensions.ToUrl(moduleFriendlyName: model.ModuleFriendlyName, portalId: portalId, controlKeyName: controlKeyName);
            return url;
        }
    }
}

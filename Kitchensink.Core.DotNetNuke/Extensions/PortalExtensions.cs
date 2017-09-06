using DotNetNuke.Common;
using DotNetNuke.Entities.Modules;
using DotNetNuke.Entities.Portals;
using DotNetNuke.Entities.Tabs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Routing;

namespace Kitchensink.Core.DotNetNuke.Extensions
{
    public static class PortalExtensions
    {
        public static String ToUrl(this string moduleFriendlyName, int portalId, string controlKeyName = "", params string[] additionalParameters)
        {
            var moduleController = new ModuleController();
            var moduleInfo = moduleController.GetAllModules().OfType<ModuleInfo>().FirstOrDefault(t => t.DesktopModule.FriendlyName == moduleFriendlyName && t.PortalID == portalId);
            if (moduleInfo == null)
                return String.Empty;

            var tabController = new TabController();
            var tabInfo = tabController.GetTab(moduleInfo.TabID, portalId, true);

            var parameters = additionalParameters.ToArray();
            if (!String.IsNullOrEmpty(controlKeyName))
            {
                parameters = new[] { String.Format("mid={0}", moduleInfo.ModuleID) }.Concat(additionalParameters).ToArray();
            }

            return Globals.NavigateURL(tabInfo.TabID, controlKeyName, parameters);
        }

        public static String ToUrl(this string moduleFriendlyName, string controlKeyName = "", params string[] additionalParameters)
        {
            return ToUrl(moduleFriendlyName, PortalController.Instance.GetCurrentPortalSettings().PortalId, controlKeyName, additionalParameters);
        }

        public static String ToUrl(this String moduleFriendlyName, String routeName, IDictionary<String, String> routeParams)
        {
            var route = RouteTable.Routes.OfType<Route>().FirstOrDefault(t => t.DataTokens.ContainsKey("name") && (String)t.DataTokens["name"] == $"{moduleFriendlyName}-{routeName}-0");

            if (route != null)
            {
                var url = route.Url;

                foreach (var item in routeParams)
                {
                    var token = String.Format("{{{0}}}", item.Key);
                    url = url.Replace(token, item.Value);
                }

                var basePath = HttpContext.Current.Request.Url.GetComponents(UriComponents.SchemeAndServer, UriFormat.Unescaped);

                return String.Concat(basePath, "/", url);
            }

            return String.Empty;
        }
    }
}

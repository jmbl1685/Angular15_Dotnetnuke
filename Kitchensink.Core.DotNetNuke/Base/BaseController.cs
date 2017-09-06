using DotNetNuke.Entities.Modules;
using DotNetNuke.Services.Tokens;
using DotNetNuke.UI.Modules;
using System;
using System.Collections.Generic;
using System.Web.UI;

namespace Kitchensink.Core.DotNetNuke.Base
{
    public class BaseController : ICustomTokenProvider
    {
        public virtual IDictionary<string, IPropertyAccess> GetTokens(Page page, ModuleInstanceContext moduleContext)
        {
            return new Dictionary<String, IPropertyAccess>
            {
                { "jsscript", new JSScriptPropertyAccess(page: page) },
                { "localization", new ModuleLocalizationPropertyAccess(moduleContext: moduleContext, page: page, html5File: "View.html") },
                { "stylesheet", new StylesheetPropertyAccess(page: page) },
                { "currentuser", new CurrentUserPropertyAccess(page: page) },
                { "navigatetourl", new NavigateToUrlPropertyAccess(page: page) },
                { "isinrole", new IsInRolePropertyAccess(page: page) },
                { "settingconfig", new SettingConfigPropertyAccess(page: page) },
                { "sessionconfig", new SessionPropertyAccess(page: page) }
            };
        }
    }
}

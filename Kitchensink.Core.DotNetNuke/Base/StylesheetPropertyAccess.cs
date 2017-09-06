using DotNetNuke.Common;
using DotNetNuke.Entities.Users;
using DotNetNuke.Framework.JavaScriptLibraries;
using DotNetNuke.Services.Tokens;
using DotNetNuke.Web.Client;
using DotNetNuke.Web.Client.ClientResourceManagement;
using System;
using System.IO;
using System.Linq;
using System.Web.UI;

namespace Kitchensink.Core.DotNetNuke.Base
{
    internal class StylesheetPropertyAccess : JsonPropertyAccess<StylesheetDto>
    {
        private readonly Page _page;

        public StylesheetPropertyAccess(Page page)
        {
            _page = page;
        }

        protected override string ProcessToken(StylesheetDto model, UserInfo accessingUser, Scope accessLevel)
        {
            string jsName = string.IsNullOrEmpty(model.JsName) ? string.Empty : model.JsName;

            if (String.IsNullOrEmpty(model.Path))
            {
                var library = JavaScriptLibraryController.Instance.GetLibraries(l => l.LibraryName.Equals(model.JsName, StringComparison.OrdinalIgnoreCase))
                                                              .OrderByDescending(l => l.Version)
                                                              .FirstOrDefault();

                if (library == null)
                    throw new ArgumentException(string.Format("The Css token must specify a path or a valid JS Name {0}.", jsName));

                if (String.IsNullOrEmpty(model.CssName))
                    throw new ArgumentException(string.Format("The Css token must specify a Css Name when use JS Name {0}.", jsName));

                model.Path = Path.Combine(GetCssPath(library, model.CssName));
            }
            if (model.Priority == 0)
            {
                model.Priority = (int)FileOrder.Css.DefaultPriority;
            }
            if (String.IsNullOrEmpty(model.Provider))
            {
                ClientResourceManager.RegisterStyleSheet(_page, model.Path, model.Priority);
            }
            else
            {
                ClientResourceManager.RegisterStyleSheet(_page, model.Path, model.Priority, model.Provider);
            }

            return String.Empty;
        }

        private static string GetCssPath(JavaScriptLibrary js, String cssName)
        {
            return ("~/Resources/libraries/" + js.LibraryName + "/" + Globals.FormatVersion(js.Version, "00", 3, "_") + "/" + cssName);
        }
    }
}

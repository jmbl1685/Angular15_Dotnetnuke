using DotNetNuke.Common;
using DotNetNuke.Entities.Users;
using DotNetNuke.Framework.JavaScriptLibraries;
using DotNetNuke.Services.Tokens;
using DotNetNuke.Web.Client;
using DotNetNuke.Web.Client.ClientResourceManagement;
using System;
using System.Linq;
using System.Web.UI;

namespace Kitchensink.Core.DotNetNuke.Base
{
    internal class JSScriptPropertyAccess : JsonPropertyAccess<JSScriptDto>
    {
        private readonly Page _page;

        public JSScriptPropertyAccess(Page page)
        {
            _page = page;
        }

        protected override string ProcessToken(JSScriptDto model, UserInfo accessingUser, Scope accessLevel)
        {
            if (!String.IsNullOrEmpty(model.JsName))
            {
                var library = JavaScriptLibraryController.Instance.GetLibraries(l => l.LibraryName.Equals(model.JsName, StringComparison.OrdinalIgnoreCase))
                                                              .OrderByDescending(l => l.Version)
                                                              .FirstOrDefault();

                if (library != null)
                {
                    if (model.Priority == 0)
                        model.Priority = (int)FileOrder.Js.DefaultPriority;

                    ClientResourceManager.RegisterScript(_page, GetScriptPath(library), model.Priority);
                }
            }
            else if (!String.IsNullOrEmpty(model.Path))
            {
                if (model.Priority == 0)
                    model.Priority = (int)FileOrder.Js.DefaultPriority;

                ClientResourceManager.RegisterScript(_page, model.Path, model.Priority);
            }

            return String.Empty;
        }

        private static string GetScriptPath(JavaScriptLibrary js)
        {
            return ("~/Resources/libraries/" + js.LibraryName + "/" + Globals.FormatVersion(js.Version, "00", 3, "_") + "/" + js.FileName);
        }
    }
}

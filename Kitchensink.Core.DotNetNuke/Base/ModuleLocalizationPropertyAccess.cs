using DotNetNuke.Entities.Users;
using DotNetNuke.Services.Localization;
using DotNetNuke.Services.Tokens;
using DotNetNuke.UI.Modules;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.IO;
using System.Resources;
using System.Web.UI;

namespace Kitchensink.Core.DotNetNuke.Base
{
    internal class ModuleLocalizationPropertyAccess : JsonPropertyAccess<ModuleLocalizationDto>
    {
        private readonly ModuleInstanceContext _moduleContext;
        private readonly Page _page;
        private readonly string _html5File;

        public ModuleLocalizationPropertyAccess(ModuleInstanceContext moduleContext, Page page, String html5File)
        {
            _html5File = html5File;
            _page = page;
            _moduleContext = moduleContext;
        }

        protected override String ProcessToken(ModuleLocalizationDto model, UserInfo accessingUser, Scope accessLevel)
        {
            String resourceFile = model.LocalResourceFile;
            var language = System.Threading.Thread.CurrentThread.CurrentUICulture;

            if (String.IsNullOrEmpty(resourceFile))
            {
                var fileName = Path.GetFileName(_html5File);
                var path = _html5File.Replace(fileName, "");

                var languageResourceFile = Path.Combine(path, Localization.LocalResourceDirectory, Path.ChangeExtension(fileName, String.Format("{0}.resx", language)));

                if (File.Exists(languageResourceFile))
                    resourceFile = languageResourceFile;
                else
                    resourceFile = Path.Combine(path, Localization.LocalResourceDirectory, Path.ChangeExtension(fileName, "resx"));
            }
            else
            {
                var languageResourceFile = Path.ChangeExtension(_page.Server.MapPath(model.LocalResourceFile), String.Format("{0}.resx", language));

                if (File.Exists(languageResourceFile))
                    resourceFile = languageResourceFile;
                else
                    resourceFile = _page.Server.MapPath(model.LocalResourceFile);
            }

            var rsxr = new ResXResourceReader(resourceFile);
            IDictionaryEnumerator id = rsxr.GetEnumerator();

            var result = new JObject();

            foreach (DictionaryEntry d in rsxr)
            {
                var key = Convert.ToString(d.Key);

                result[Path.GetFileNameWithoutExtension(key)] = Convert.ToString(d.Value);
            }


            return JsonConvert.SerializeObject(result);
        }
    }
}

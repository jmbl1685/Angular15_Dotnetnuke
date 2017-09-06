using Newtonsoft.Json;

namespace Kitchensink.Core.DotNetNuke.Base
{
    internal class ModuleLocalizationDto
    {
        [JsonProperty("localresourcefile")]
        public string LocalResourceFile { get; set; }
    }
}

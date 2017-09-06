using Newtonsoft.Json;

namespace Kitchensink.Core.DotNetNuke.Base
{
    internal class JSScriptDto
    {
        [JsonProperty("jsname")]
        public string JsName { get; set; }

        [JsonProperty("path")]
        public string Path { get; set; }

        [JsonProperty("priority")]
        public int Priority { get; set; }

        [JsonProperty("provider")]
        public string Provider { get; set; }

        [JsonProperty("specific")]
        public string Specific { get; set; }

        [JsonProperty("version")]
        public string Version { get; set; }
    }
}
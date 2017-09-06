using Newtonsoft.Json;

namespace Kitchensink.Core.DotNetNuke.Base
{
    internal class StylesheetDto
    {
        [JsonProperty("jsname")]
        public string JsName { get; set; }

        [JsonProperty("cssname")]
        public string CssName { get; set; }

        [JsonProperty("path")]
        public string Path { get; set; }

        [JsonProperty("priority")]
        public int Priority { get; set; }

        [JsonProperty("provider")]
        public string Provider { get; set; }
    }
}

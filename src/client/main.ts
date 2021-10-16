import m from "mithril";


m.route (document.getElementById ("app-root"), "/",
{
	"/":
	{
		render ()
		{
			return m ("div", "Hi!");
		}
	}
});

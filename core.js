(function () {
    var USERS_KEY = "wardrobeUsers";
    var SESSION_KEY = "wardrobeUser";
    var ITEMS_KEY = "wardrobeItems";
    var FEEDBACK_KEY = "feedbacks";

    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var outfits = {
        "summer": ["Summer Look", "Floral top + shorts + sneakers",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"],
        "winter": ["Winter Look", "Sweater + jeans + coat + boots",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80"],
        "ethnic": ["Ethnic Look", "Traditional suit + jhumkas",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"],
        "date night": ["Date Night Look", "Western dress + heels + handbag",
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80"],
        "party": ["Party Look", "Party dress + heels + accessories",
            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"],
        "spring": ["Spring Look", "Pastel top + light trousers",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"],
        "monsoon": ["Monsoon Look", "Light top + trousers + rain-friendly shoes",
            "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=800&q=80"],
        "autumn": ["Autumn Look", "Long-sleeve top + jeans + jacket",
            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"],
        "college": ["College Look", "White top + blue jeans + sneakers",
            "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80"],
        "casual": ["Casual Look", "T-shirt + jeans + sneakers",
            "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=800&q=80"]
    };

    var aliases = [
        ["kurti", "ethnic"], ["saree", "ethnic"], ["sari", "ethnic"], ["lehenga", "ethnic"],
        ["traditional", "ethnic"], ["festival", "ethnic"], ["wedding", "ethnic"],
        ["birthday", "party"], ["club", "party"],
        ["rainy", "monsoon"], ["rain", "monsoon"],
        ["fall", "autumn"],
        ["dating", "date night"], ["date", "date night"],
        ["campus", "college"], ["class", "college"],
        ["hot", "summer"], ["cold", "winter"]
    ];

    var lookCategories = {
        "summer": ["Tops", "Bottoms"],
        "winter": ["Tops", "Bottoms", "Shoes"],
        "ethnic": ["Dresses"],
        "date night": ["Dresses", "Shoes"],
        "party": ["Dresses", "Shoes"],
        "spring": ["Tops", "Bottoms"],
        "monsoon": ["Tops", "Bottoms", "Shoes"],
        "autumn": ["Tops", "Bottoms"],
        "college": ["Tops", "Bottoms", "Shoes"],
        "casual": ["Tops", "Bottoms", "Shoes"]
    };

    var combinations = {
        purple: ["White", "Beige", "Light Grey"],
        pink: ["White", "Cream", "Brown"],
        beige: ["White", "Brown", "Black"],
        black: ["White", "Grey", "Pink"],
        blue: ["White", "Beige", "Navy Blue"]
    };

    var vibes = ["Soft & Elegant", "Minimal", "Trendy", "Casual"];
    var categories = ["Tops", "Bottoms", "Dresses", "Shoes"];

    var PREFS_KEY = "wardrobePrefs";
    var PREF_NAMES = ["lastLook", "color", "vibe", "filter"];

    var defaultItems = [
        { id: 1, name: "White Top", category: "Tops", detail: "Casual • White",
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80" },
        { id: 2, name: "Blue Jeans", category: "Bottoms", detail: "Casual • Blue",
          image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&q=80" },
        { id: 3, name: "Summer Dress", category: "Dresses", detail: "Party • Pink",
          image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80" },
        { id: 4, name: "Denim Jacket", category: "Tops", detail: "Casual • Blue",
          image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=500&q=80" }
    ];

    function loadItems() {
        var items = read(ITEMS_KEY, null);
        if (!Array.isArray(items)) {
            items = defaultItems.map(function (i) { return Object.assign({}, i); });
            write(ITEMS_KEY, items);
        }
        return items;
    }

    var schema = null;

    function read(key, fallback) {
        try {
            var raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            return fallback;
        }
    }

    function write(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    }

    function hashPassword(text) {
        if (window.crypto && window.crypto.subtle && window.TextEncoder) {
            return window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(function (buffer) {
                return Array.prototype.map.call(new Uint8Array(buffer), function (b) {
                    return ("0" + b.toString(16)).slice(-2);
                }).join("");
            });
        }
        var h = 5381;
        for (var i = 0; i < text.length; i++) {
            h = ((h << 5) + h + text.charCodeAt(i)) | 0;
        }
        return Promise.resolve("x" + h);
    }

    function isValidUrl(value) {
        try {
            var u = new URL(value);
            return u.protocol === "http:" || u.protocol === "https:";
        } catch (e) {
            return false;
        }
    }

    function getPrefs() {
        var prefs = read(PREFS_KEY, {});
        return prefs && typeof prefs === "object" ? prefs : {};
    }

    function setPref(name, value) {
        if (PREF_NAMES.indexOf(name) === -1) return false;
        var prefs = getPrefs();
        prefs[name] = value;
        return write(PREFS_KEY, prefs);
    }

    var handlers = {
        setPreference: function (args) {
            var ok = setPref(String(args.name || ""), String(args.value === undefined || args.value === null ? "" : args.value));
            return { ok: ok };
        },

        getPreferences: function () {
            return { ok: true, preferences: getPrefs() };
        },

        registerUser: function (args) {
            var name = String(args.name || "").trim();
            var email = String(args.email || "").trim().toLowerCase();
            var password = String(args.password || "");
            var confirm = String(args.confirmPassword || "");

            if (!name || !email || !password || !confirm) {
                return { ok: false, message: "Please fill all the fields" };
            }
            if (!EMAIL_PATTERN.test(email)) {
                return { ok: false, message: "Please enter a valid email" };
            }
            if (password.length < 8) {
                return { ok: false, message: "Password must have at least 8 characters" };
            }
            if (password !== confirm) {
                return { ok: false, message: "Passwords do not match" };
            }

            var users = read(USERS_KEY, []);
            var exists = users.some(function (u) { return u.email === email; });
            if (exists) {
                return { ok: false, message: "An account with this email already exists" };
            }

            return hashPassword(password).then(function (hash) {
                users.push({ name: name, email: email, password: hash, createdAt: new Date().toISOString() });
                if (!write(USERS_KEY, users)) {
                    return { ok: false, message: "Could not save your account in this browser" };
                }
                var user = { name: name, email: email };
                write(SESSION_KEY, user);
                return { ok: true, message: "Account created successfully!", user: user };
            });
        },

        loginUser: function (args) {
            var email = String(args.email || "").trim().toLowerCase();
            var password = String(args.password || "");

            if (!EMAIL_PATTERN.test(email)) {
                return { ok: false, field: "email", message: "Please enter a valid email" };
            }
            if (password.length < 8) {
                return { ok: false, field: "password", message: "Password must have at least 8 characters" };
            }

            var users = read(USERS_KEY, []);
            var found = users.filter(function (u) { return u.email === email; })[0];
            if (!found) {
                return { ok: false, field: "email", message: "No account found with this email" };
            }

            return hashPassword(password).then(function (hash) {
                if (hash !== found.password) {
                    return { ok: false, field: "password", message: "Incorrect password" };
                }
                var user = { name: found.name, email: found.email };
                write(SESSION_KEY, user);
                return { ok: true, message: "Signed in successfully!", user: user };
            });
        },

        getProfile: function () {
            var user = handlers.getCurrentUser().user;
            if (!user) {
                return { ok: false, message: "Please sign in first" };
            }
            var record = read(USERS_KEY, []).filter(function (u) { return u.email === user.email; })[0] || {};
            var feedbacks = read(FEEDBACK_KEY, []).filter(function (f) {
                return String(f.email).toLowerCase() === user.email;
            });
            return {
                ok: true,
                profile: {
                    name: user.name,
                    email: user.email,
                    createdAt: record.createdAt || null,
                    items: loadItems().length,
                    feedbacks: feedbacks.length
                }
            };
        },

        updateProfile: function (args) {
            var user = handlers.getCurrentUser().user;
            if (!user) {
                return { ok: false, message: "Please sign in first" };
            }
            var name = String(args.name || "").trim();
            if (!name) {
                return { ok: false, message: "Name cannot be empty" };
            }
            var users = read(USERS_KEY, []);
            users.forEach(function (u) {
                if (u.email === user.email) u.name = name;
            });
            if (!write(USERS_KEY, users) || !write(SESSION_KEY, { name: name, email: user.email })) {
                return { ok: false, message: "Could not save your profile" };
            }
            return { ok: true, message: "Profile updated successfully!", user: { name: name, email: user.email } };
        },

        changePassword: function (args) {
            var user = handlers.getCurrentUser().user;
            if (!user) {
                return { ok: false, message: "Please sign in first" };
            }
            var current = String(args.currentPassword || "");
            var next = String(args.newPassword || "");
            var confirm = String(args.confirmPassword || "");
            if (!current || !next || !confirm) {
                return { ok: false, message: "Please fill all the fields" };
            }
            if (next.length < 8) {
                return { ok: false, message: "Password must have at least 8 characters" };
            }
            if (next !== confirm) {
                return { ok: false, message: "Passwords do not match" };
            }
            var users = read(USERS_KEY, []);
            var record = users.filter(function (u) { return u.email === user.email; })[0];
            if (!record) {
                return { ok: false, message: "Account not found" };
            }
            return hashPassword(current).then(function (hash) {
                if (hash !== record.password) {
                    return { ok: false, message: "Current password is incorrect" };
                }
                return hashPassword(next).then(function (newHash) {
                    record.password = newHash;
                    if (!write(USERS_KEY, users)) {
                        return { ok: false, message: "Could not save your password" };
                    }
                    return { ok: true, message: "Password changed successfully!" };
                });
            });
        },

        logoutUser: function () {
            try {
                localStorage.removeItem(SESSION_KEY);
            } catch (e) {
                return { ok: false };
            }
            return { ok: true };
        },

        getCurrentUser: function () {
            var user = read(SESSION_KEY, null);
            return { user: user && user.name ? user : null };
        },

        recommendOutfit: function (args) {
            var text = String(args.query || "").toLowerCase().trim();
            if (!text) {
                return { ok: false, message: "Tell me an occasion or season first." };
            }

            var key = Object.keys(outfits).filter(function (k) {
                return text.indexOf(k) !== -1;
            })[0];

            if (!key) {
                var hit = aliases.filter(function (pair) {
                    return text.indexOf(pair[0]) !== -1;
                })[0];
                key = hit ? hit[1] : null;
            }

            if (!key) {
                return {
                    ok: false,
                    title: "Style Not Found",
                    message: "Try summer, winter, ethnic, date night, party, college or casual."
                };
            }

            setPref("lastLook", key);

            return {
                ok: true,
                key: key,
                title: outfits[key][0],
                description: outfits[key][1],
                image: outfits[key][2]
            };
        },

        suggestFromWardrobe: function (args) {
            var look = String(args.look || "").toLowerCase();
            var needed = lookCategories[look];
            if (!needed) {
                return { ok: false, items: [], message: "Pick a look first." };
            }

            var all = loadItems();
            var items = [];
            needed.forEach(function (category) {
                var match = all.filter(function (i) { return i.category === category; })[0];
                if (match) items.push(match);
            });

            if (!items.length) {
                return {
                    ok: false,
                    items: [],
                    message: "Add some " + needed.join(", ").toLowerCase() + " to My Wardrobe first."
                };
            }

            return {
                ok: true,
                items: items,
                message: "Try this outfit with: " + items.map(function (i) { return i.name; }).join(" + ")
            };
        },

        addClothingItem: function (args) {
            var name = String(args.name || "").trim();
            var category = String(args.category || "");
            var image = String(args.image || "").trim();

            if (!name) {
                return { ok: false, message: "Please enter a clothing name" };
            }
            if (categories.indexOf(category) === -1) {
                return { ok: false, message: "Please choose a valid category" };
            }
            if (!isValidUrl(image)) {
                return { ok: false, message: "Please enter a valid image URL" };
            }

            var items = loadItems();
            var item = { id: Date.now(), name: name, category: category, image: image };
            items.push(item);
            if (!write(ITEMS_KEY, items)) {
                return { ok: false, message: "Could not save this item in the browser" };
            }
            return { ok: true, message: "Clothing added successfully!", item: item };
        },

        listClothes: function (args) {
            var category = args && args.category ? String(args.category) : "All";
            var items = loadItems();
            if (category !== "All") {
                items = items.filter(function (i) { return i.category === category; });
            }
            return { items: items };
        },

        getColorMatches: function (args) {
            var color = String(args.color || "").toLowerCase();
            if (!combinations[color]) {
                return { ok: false, matches: [], title: "" };
            }
            return {
                ok: true,
                title: "Colours that match " + color,
                matches: combinations[color].slice()
            };
        },

        findMyStyle: function (args) {
            var color = String(args.color || "").toLowerCase();
            var vibe = String(args.vibe || "");

            if (!combinations[color]) {
                return { ok: false, message: "Pick a favourite colour first." };
            }

            var vibeText = vibes.indexOf(vibe) !== -1 ? vibe + " " : "";
            var search = color + " " + vibeText.toLowerCase() + "outfit ideas clothing";

            var message = vibeText
                ? "Your style: " + vibe + " in " + color + ", paired with " + combinations[color].join(", ") + "."
                : "Your colour palette: " + color + " with " + combinations[color].join(", ") + ".";

            return {
                ok: true,
                message: message,
                url: "https://www.google.com/search?tbm=isch&q=" + encodeURIComponent(search)
            };
        },

        submitFeedback: function (args) {
            var name = String(args.name || "").trim();
            var email = String(args.email || "").trim();
            var rating = String(args.rating || "");
            var message = String(args.message || "").trim();

            if (!name || !email || !rating || !message) {
                return { ok: false, message: "Please fill all fields" };
            }
            if (!EMAIL_PATTERN.test(email)) {
                return { ok: false, message: "Please enter a valid email" };
            }

            var data = read(FEEDBACK_KEY, []);
            data.push({ name: name, email: email, rating: rating, message: message });
            if (!write(FEEDBACK_KEY, data)) {
                return { ok: false, message: "Could not save your feedback" };
            }
            return { ok: true, message: "Thank you for your feedback! " };
        }
    };

    function validate(name, args) {
        if (!schema) return null;
        var def = schema.filter(function (f) { return f.name === name; })[0];
        if (!def) return null;
        var required = (def.parameters && def.parameters.required) || [];
        var missing = required.filter(function (key) {
            return args[key] === undefined || args[key] === null;
        });
        return missing.length ? "Missing arguments: " + missing.join(", ") : null;
    }

    function call(name, args) {
        args = args || {};
        if (!Object.prototype.hasOwnProperty.call(handlers, name)) {
            return Promise.reject(new Error("Unknown function: " + name));
        }
        var problem = validate(name, args);
        if (problem) {
            return Promise.resolve({ ok: false, message: problem });
        }
        try {
            return Promise.resolve(handlers[name](args));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    function list() {
        return Object.keys(handlers);
    }

    function describe() {
        return schema ? schema.slice() : [];
    }

    function loadSchema() {
        if (!window.fetch || (location.protocol !== "http:" && location.protocol !== "https:")) return;
        fetch("functions.json")
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (json) {
                if (json && Array.isArray(json.functions)) schema = json.functions;
            })
            .catch(function () {});
    }

    var menuListenerAdded = false;

    function buildMenu(user) {
        var wrap = document.createElement("div");
        wrap.className = "profile-menu";

        var button = document.createElement("a");
        button.href = "profile.html";
        button.className = "sign-in profile-btn";
        button.setAttribute("aria-haspopup", "true");
        button.setAttribute("aria-expanded", "false");

        var avatar = document.createElement("span");
        avatar.className = "avatar";
        avatar.textContent = user.name.trim().charAt(0).toUpperCase();

        var label = document.createElement("span");
        label.textContent = user.name.trim().split(/\s+/)[0] + " ▾";

        button.append(avatar, label);

        var dropdown = document.createElement("div");
        dropdown.className = "profile-dropdown";

        var who = document.createElement("div");
        who.className = "profile-who";
        var strong = document.createElement("b");
        strong.textContent = user.name;
        var mail = document.createElement("small");
        mail.textContent = user.email;
        who.append(strong, mail);

        var profileLink = document.createElement("a");
        profileLink.href = "profile.html";
        profileLink.textContent = "My Profile";

        var wardrobeLink = document.createElement("a");
        wardrobeLink.href = "wardrobe.html";
        wardrobeLink.textContent = "My Wardrobe";

        var signOut = document.createElement("a");
        signOut.href = "index.html";
        signOut.textContent = "Sign Out";
        signOut.onclick = function (event) {
            event.preventDefault();
            handlers.logoutUser();
            window.location.href = "index.html";
        };

        dropdown.append(who, profileLink, wardrobeLink, signOut);
        wrap.append(button, dropdown);

        button.onclick = function (event) {
            event.preventDefault();
            var open = wrap.classList.toggle("open");
            button.setAttribute("aria-expanded", open ? "true" : "false");
        };

        return wrap;
    }

    function refreshNav() {
        var user = handlers.getCurrentUser().user;

        document.querySelectorAll(".nav-links > .sign-in, .nav-links > .profile-menu").forEach(function (link) {
            if (user) {
                link.replaceWith(buildMenu(user));
            }
        });

        if (!menuListenerAdded) {
            menuListenerAdded = true;
            document.addEventListener("click", function (event) {
                document.querySelectorAll(".profile-menu.open").forEach(function (menu) {
                    if (!menu.contains(event.target)) {
                        menu.classList.remove("open");
                        menu.querySelector(".profile-btn").setAttribute("aria-expanded", "false");
                    }
                });
            });
            document.addEventListener("keydown", function (event) {
                if (event.key === "Escape") {
                    document.querySelectorAll(".profile-menu.open").forEach(function (menu) {
                        menu.classList.remove("open");
                    });
                }
            });
        }
    }

    window.AIWardrobe = {
        call: call,
        list: list,
        describe: describe,
        refreshNav: refreshNav
    };

    loadSchema();

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", refreshNav);
    } else {
        refreshNav();
    }
})();

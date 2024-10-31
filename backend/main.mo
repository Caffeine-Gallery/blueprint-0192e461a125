import Float "mo:base/Float";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor WebsiteBuilder {
    // Types for the website components
    type StyleProperties = {
        fontSize: Text;
        color: Text;
        backgroundColor: Text;
        padding: Text;
    };

    type Component = {
        id: Text;
        type_: Text;
        x: Float;
        y: Float;
        content: Text;
        styles: StyleProperties;
    };

    // Stable storage for components
    private stable var componentsEntries : [(Text, Component)] = [];
    private var components = HashMap.HashMap<Text, Component>(0, Text.equal, Text.hash);

    // System functions for upgrade persistence
    system func preupgrade() {
        componentsEntries := Iter.toArray(components.entries());
    };

    system func postupgrade() {
        components := HashMap.fromIter<Text, Component>(componentsEntries.vals(), 1, Text.equal, Text.hash);
        componentsEntries := [];
    };

    // Add a new component
    public shared func addComponent(component: Component) : async () {
        components.put(component.id, component);
    };

    // Update an existing component
    public shared func updateComponent(component: Component) : async () {
        components.put(component.id, component);
    };

    // Delete a component
    public shared func deleteComponent(id: Text) : async () {
        components.delete(id);
    };

    // Save the entire layout
    public shared func saveLayout(layout: [Component]) : async () {
        components := HashMap.HashMap<Text, Component>(0, Text.equal, Text.hash);
        for (component in layout.vals()) {
            components.put(component.id, component);
        };
    };

    // Load the entire layout
    public shared query func loadLayout() : async [Component] {
        Iter.toArray(components.vals())
    };

    // Get a specific component
    public shared query func getComponent(id: Text) : async ?Component {
        components.get(id)
    };
}

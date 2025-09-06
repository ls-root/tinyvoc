// Custom made library for TinyVoc for creating ASCII tree graphics
// by lsroot
// License: GPLv3

// Example tree object:
// const tree = {
// name: "root",
//  children: [
//    {
//      name: "child1",
//      children: [
//        { name: "subchild1", children: [] },
//        { name: "subchild2", children: [] }
//      ]
//    },
//    {
//      name: "child2",
//      children: []
//    }
//  ]
// }

function printTree(node, output, prefix = "") {
  output.push(prefix + "- " + node.name)
  node.children.forEach(child => {
    printTree(child, output, prefix + "  ")
  })
}

from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)
grocery_list = []

@app.route('/')
def index():
    return render_template('index.html', grocery_list=grocery_list)

@app.route('/add', methods=['POST'])
def add_item():
    name = request.form.get('name')
    quantity = request.form.get('quantity')
    price = request.form.get('price')
    category = request.form.get('category')

    if name and quantity and price:
        grocery_list.append({"name": name, "quantity": quantity, "price": price, "category": category})
        return jsonify(success=True, index=len(grocery_list) - 1)
    return jsonify(success=False)

@app.route('/delete', methods=['POST'])
def delete_item():
    index = int(request.form.get('index'))
    if 0 <= index < len(grocery_list):
        del grocery_list[index]
        return jsonify(success=True)
    return jsonify(success=False)

if __name__ == '__main__':
    app.run(debug=True)

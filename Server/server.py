from flask import Flask

app = Flask(__name__)


@app.route("/api/process", methods=["POST"])
def process():
    return "Hello World"


if __name__ == "__main__":
    app.run()

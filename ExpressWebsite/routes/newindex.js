var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('newindex', { title: 'New Test By Express' });
});

/* GET login page. */
router.route("/newlogin").get(function(req,res){    // �����·������Ⱦlogin�ļ���������titleֵ�� login.htmlʹ��
	res.render("newlogin",{title:'User Login', message:'this is a new login message.'});
}).post(function(req,res){                        // �Ӵ�·����⵽post��ʽ�����post���ݵĴ������
	//get User info
	//�����User���Ǵ�model�л�ȡuser����ͨ��global.dbHandelȫ�ַ��������������app.js���Ѿ�ʵ��)
	var User = global.dbHandel.getModel('user');
	var uname = req.body.uname;                //��ȡpost������ data������ uname��ֵ
	User.findOne({name:uname},function(err,doc){   //ͨ����model���û��������� ��ѯ���ݿ��е�ƥ����Ϣ
		if(err){                                         //����ͷ��ظ�ԭpost����login.html) ״̬��Ϊ500�Ĵ���
			res.send(500);
			console.log(err);
		}else if(!doc){                                 //��ѯ�����û���ƥ����Ϣ�����û���������
			req.session.error = '�û���������';
			res.send(404);                            //    ״̬�뷵��404
			//    res.redirect("/login");
		}else{
			if(req.body.upwd != doc.password){     //��ѯ��ƥ���û�������Ϣ������Ӧ��password���Բ�ƥ��
				req.session.error = "�������";
				res.send(404);
				//    res.redirect("/login");
			}else{                                     //��Ϣƥ��ɹ����򽫴˶���ƥ�䵽��user) ����session.user  �����سɹ�
				req.session.user = doc;
				res.send(200);
				//    res.redirect("/home");
			}
		}
	});
});

/* GET register page. */
router.route("/newregister").get(function(req,res){    // �����·������Ⱦregister�ļ���������titleֵ�� register.htmlʹ��
	res.render("newregister",{title:'User register' ,message:'this is a register message.'});
}).post(function(req,res){
	//�����User���Ǵ�model�л�ȡuser����ͨ��global.dbHandelȫ�ַ��������������app.js���Ѿ�ʵ��)
	var User = global.dbHandel.getModel('user');
	var uname = req.body.uname;
	var upwd = req.body.upwd;
	console.log("uname:",uname)
	console.log("upwd:",upwd)
	User.findOne({name: uname},function(err,doc){   // ͬ�� /login ·���Ĵ���ʽ
		if(err){
			res.send(500);
			req.session.error =  '�����쳣����';
			console.log(err);
		}else if(doc){
			req.session.error = '�û����Ѵ��ڣ�';
			res.send(500);
		}else{
			User.create({                             // ����һ��user��������model
				name: uname,
				password: upwd
			},function(err,doc){
				if (err) {
					res.send(500);
					console.log(err);
				} else {
					req.session.error = '�û��������ɹ���';
					res.send(200);
				}
			});
		}
	});
});

/* GET home page. */
router.get("/newhome",function(req,res){ 
    if(!req.session.user){                     //����/home·�������ж��Ƿ��Ѿ���¼
        req.session.error = "���ȵ�¼"
        res.redirect("/newlogin");                //δ��¼���ض��� /login ·��
    }
    res.render("newhome",{title:'Home'});         //�ѵ�¼����Ⱦhomeҳ��
});

/* GET logout page. */
router.get("/newlogout",function(req,res){    // ���� /logout ·����ǳ��� session��user,error�����ÿգ����ض��򵽸�·��
    req.session.user = null;
    req.session.error = null;
    res.redirect("/");
});
module.exports = router;
